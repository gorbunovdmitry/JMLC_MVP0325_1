# --- Оптимизировано для Raspberry Pi Zero 2 W ---
import asyncio
import websockets
import RPi.GPIO as GPIO
import cv2
import sounddevice as sd
import numpy as np
import time
import io
from gtts import gTTS
import tempfile
import os

# --- Настройки ---
BUTTON_PIN = 17  # GPIO номер кнопки
STREAM_WS_URL = 'ws://your-gemini-or-backup-server/ws/stream'  # WebSocket endpoint
SAMPLE_RATE = 16000
AUDIO_CHUNK_SEC = 0.5  # Оптимально для Pi Zero 2 W
VIDEO_FPS = 5          # Оптимально для Pi Zero 2 W
VIDEO_WIDTH = 320      # Оптимально для Pi Zero 2 W
VIDEO_HEIGHT = 240     # Оптимально для Pi Zero 2 W
INACTIVITY_TIMEOUT = 3  # секунд

# --- GPIO ---
GPIO.setmode(GPIO.BCM)
GPIO.setup(BUTTON_PIN, GPIO.IN, pull_up_down=GPIO.PUD_UP)

def button_pressed():
    return GPIO.input(BUTTON_PIN) == GPIO.LOW

# --- Motion Detection ---
def is_motion(prev_frame, curr_frame, threshold=30):
    if prev_frame is None or curr_frame is None:
        return False
    diff = cv2.absdiff(prev_frame, curr_frame)
    gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 25, 255, cv2.THRESH_BINARY)
    motion = np.sum(thresh) / 255
    return motion > threshold

# --- Simple VAD ---
def is_voice(audio_chunk, energy_threshold=500):
    energy = np.sum(np.abs(audio_chunk)) / len(audio_chunk)
    return energy > energy_threshold

# --- Озвучивание через TTS ---
def speak_text(text):
    tts = gTTS(text=text, lang='en')
    with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as fp:
        tts.save(fp.name)
        os.system(f'mpg123 {fp.name}')  # Требуется mpg123 или аналог
    os.remove(fp.name)

# --- Streaming Session ---
async def streaming_session():
    print('Session started!')
    async with websockets.connect(STREAM_WS_URL, max_size=2**24) as ws:
        cap = cv2.VideoCapture(0)
        cap.set(cv2.CAP_PROP_FRAME_WIDTH, VIDEO_WIDTH)
        cap.set(cv2.CAP_PROP_FRAME_HEIGHT, VIDEO_HEIGHT)
        cap.set(cv2.CAP_PROP_FPS, VIDEO_FPS)
        prev_frame = None
        last_active = time.time()
        audio_buffer = []
        def audio_callback(indata, frames, time_info, status):
            audio_buffer.append(indata.copy())
        stream = sd.InputStream(samplerate=SAMPLE_RATE, channels=1, dtype='int16', callback=audio_callback)
        stream.start()
        try:
            async def sender():
                nonlocal prev_frame, last_active
                while True:
                    ret, frame = cap.read()
                    if not ret:
                        continue
                    # Motion detection
                    motion = is_motion(prev_frame, frame)
                    prev_frame = frame.copy()
                    # Audio chunk
                    if len(audio_buffer) > 0:
                        audio_chunk = np.concatenate(audio_buffer, axis=0)
                        audio_buffer.clear()
                    else:
                        audio_chunk = np.zeros((int(SAMPLE_RATE * AUDIO_CHUNK_SEC), 1), dtype='int16')
                    voice = is_voice(audio_chunk)
                    # Активность
                    if motion or voice:
                        last_active = time.time()
                    # --- Streaming ---
                    # Отправляем кадр
                    _, img_encoded = cv2.imencode('.jpg', frame)
                    await ws.send(img_encoded.tobytes())
                    # Отправляем аудио
                    await ws.send(audio_chunk.tobytes())
                    # Проверяем неактивность
                    if time.time() - last_active > INACTIVITY_TIMEOUT:
                        print('Session ended due to inactivity.')
                        break
                    await asyncio.sleep(1 / VIDEO_FPS)
            async def receiver():
                while True:
                    try:
                        text = await ws.recv()
                        if isinstance(text, str) and text.strip():
                            print(f'Received for TTS: {text}')
                            speak_text(text)
                    except Exception:
                        break
            await asyncio.gather(sender(), receiver())
        finally:
            stream.stop()
            cap.release()
            await ws.close()
    print('Session closed.')

# --- Main loop ---
def main():
    print('Waiting for button press...')
    try:
        while True:
            if button_pressed():
                asyncio.run(streaming_session())
                print('Waiting for button press...')
            time.sleep(0.1)
    except KeyboardInterrupt:
        GPIO.cleanup()

if __name__ == '__main__':
    main() 
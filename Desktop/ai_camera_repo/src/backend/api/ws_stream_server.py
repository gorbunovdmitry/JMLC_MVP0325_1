import asyncio
import websockets
import numpy as np
import cv2
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, status
from fastapi.responses import JSONResponse
import uvicorn
import tempfile
import os
import requests
import logging
from google.cloud import storage

app = FastAPI()

ML_ENDPOINT = 'http://ml-model-stub.local/api/infer'  # Заглушка
GCS_BUCKET = 'your-gcs-bucket'  # Заглушка
GCS_CREDENTIALS = 'path/to/your/credentials.json'  # Заглушка
REQUIRED_TOKEN = 'my_secret_token'  # Заглушка

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')

# --- GCS upload ---
def upload_to_gcs(local_path, remote_name):
    os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = GCS_CREDENTIALS
    client = storage.Client()
    bucket = client.bucket(GCS_BUCKET)
    blob = bucket.blob(remote_name)
    blob.upload_from_filename(local_path)
    logging.info(f'Uploaded to GCS: gs://{GCS_BUCKET}/{remote_name}')

@app.websocket('/ws/stream')
async def stream_endpoint(websocket: WebSocket):
    # --- Security: check token ---
    token = websocket.query_params.get('token')
    if token != REQUIRED_TOKEN:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        logging.warning('Connection rejected: invalid token')
        return
    await websocket.accept()
    session_id = id(websocket)
    logging.info(f'Stream started: {session_id}')
    frames = []
    audios = []
    try:
        while True:
            frame_bytes = await websocket.receive_bytes()
            audio_bytes = await websocket.receive_bytes()
            frames.append(frame_bytes)
            audios.append(audio_bytes)
            # --- Пример онлайн-инференса ---
            try:
                files = {
                    'frame': ('frame.jpg', frame_bytes, 'image/jpeg'),
                    'audio': ('audio.wav', audio_bytes, 'audio/wav'),
                }
                response = requests.post(ML_ENDPOINT, files=files, timeout=5)
                response.raise_for_status()
                text = response.text
            except Exception as e:
                text = f"[ML error: {e}]"
                logging.error(f'ML error: {e}')
            await websocket.send_text(text)
    except WebSocketDisconnect:
        logging.info(f'Stream ended: {session_id}')
        # --- Save to temp and upload to GCS ---
        with tempfile.TemporaryDirectory() as tmpdir:
            video_path = os.path.join(tmpdir, f'session_{session_id}.avi')
            audio_path = os.path.join(tmpdir, f'session_{session_id}.wav')
            # Save video
            if frames:
                first_frame = cv2.imdecode(np.frombuffer(frames[0], np.uint8), 1)
                height, width, _ = first_frame.shape
                out = cv2.VideoWriter(video_path, cv2.VideoWriter_fourcc(*'XVID'), 10, (width, height))
                for f in frames:
                    frame = cv2.imdecode(np.frombuffer(f, np.uint8), 1)
                    out.write(frame)
                out.release()
                logging.info(f'Video saved: {video_path}')
                try:
                    upload_to_gcs(video_path, f'video/session_{session_id}.avi')
                except Exception as e:
                    logging.error(f'GCS upload error (video): {e}')
            # Save audio
            if audios:
                import wave
                audio_data = b''.join(audios)
                with wave.open(audio_path, 'wb') as wf:
                    wf.setnchannels(1)
                    wf.setsampwidth(2)
                    wf.setframerate(16000)
                    wf.writeframes(audio_data)
                logging.info(f'Audio saved: {audio_path}')
                try:
                    upload_to_gcs(audio_path, f'audio/session_{session_id}.wav')
                except Exception as e:
                    logging.error(f'GCS upload error (audio): {e}')

if __name__ == '__main__':
    uvicorn.run('ws_stream_server:app', host='0.0.0.0', port=8001, reload=True) 
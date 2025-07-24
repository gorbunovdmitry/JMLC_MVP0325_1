import cv2
from typing import Generator

class CameraStreamer:
    """Capture frames from CSI or USB camera."""

    def __init__(self, device: int = 0, width: int = 1280, height: int = 720):
        self.cap = cv2.VideoCapture(device)
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, height)

    def frames(self) -> Generator[bytes, None, None]:
        while True:
            success, frame = self.cap.read()
            if not success:
                continue
            yield frame

    def release(self):
        self.cap.release()

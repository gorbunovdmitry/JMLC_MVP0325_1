import onnxruntime as ort
import numpy as np
from pathlib import Path
from typing import List, Tuple

class Yolov8Detector:
    def __init__(self, model_path: str):
        self.session = ort.InferenceSession(model_path, providers=['CPUExecutionProvider'])
        self.input_name = self.session.get_inputs()[0].name

    def preprocess(self, frame) -> np.ndarray:
        # resize → RGB → NCHW
        img = cv2.resize(frame, (640, 640))
        img = img[:, :, ::-1].transpose(2, 0, 1).astype('float32') / 255.0
        return np.expand_dims(img, 0)

    def postprocess(self, outputs, conf_threshold=0.4) -> List[Tuple[str, float]]:
        # stub – replace with NMS
        return []

    def __call__(self, frame):
        input_tensor = self.preprocess(frame)
        outputs = self.session.run(None, {self.input_name: input_tensor})[0]
        return self.postprocess(outputs)

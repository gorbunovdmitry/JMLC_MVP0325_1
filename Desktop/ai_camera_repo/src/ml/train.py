"""Stub training script that would fit YOLOv8 model using Ultralytics lib."""
import os, argparse, yaml, random

def main(cfg_path: str):
    import torch
    from ultralytics import YOLO

    with open(cfg_path) as f:
        cfg = yaml.safe_load(f)

    model = YOLO(cfg['model_name'])
    model.train(
        data=cfg['dataset_yaml'],
        epochs=cfg['epochs'],
        imgsz=cfg['img_size'],
        batch=cfg['batch'],
    )
    model.export(format='onnx', imgsz=cfg['img_size'])

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--cfg', default='src/ml/model/yolo_config.yaml')
    args = parser.parse_args()
    main(args.cfg)

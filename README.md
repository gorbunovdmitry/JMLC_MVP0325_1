# AI Camera – Wildlife Detection System

An open‑source edge-to-cloud solution that detects wildlife (boars, moose, bears) and sends real‑time alerts.

## Quick Start

```bash
git clone <repo_url>
cd ai_camera_repo
docker compose up  # launches backend + dashboard
```

* Edge device: Raspberry Pi Zero 2 W  
* Model: YOLOv8‑nano (ONNX)  
* Cloud: AWS IoT Core → Lambda → S3/TimeStream  

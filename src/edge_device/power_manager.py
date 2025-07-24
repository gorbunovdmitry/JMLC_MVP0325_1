import psutil
import time

def battery_percentage() -> float:
    battery = psutil.sensors_battery()
    return battery.percent if battery else 100.0

def adaptive_sleep(threshold: float = 20.0):
    """Sleep longer when battery is low."""
    percent = battery_percentage()
    if percent < threshold:
        time.sleep(300)  # 5 min
    else:
        time.sleep(60)

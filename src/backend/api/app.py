from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import datetime

app = FastAPI(title='AI Camera Backend')

class Event(BaseModel):
    camera_id: str
    label: str
    confidence: float
    timestamp: datetime.datetime

events = []

@app.get('/health')
def health():
    return {'status': 'ok'}

@app.post('/event')
def post_event(event: Event):
    events.append(event)
    return {'received': True}

@app.get('/events')
def get_events():
    return events

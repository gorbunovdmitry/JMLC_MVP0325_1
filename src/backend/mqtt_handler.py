import paho.mqtt.client as mqtt, json, os

BROKER = os.getenv('MQTT_BROKER', 'localhost')

def on_connect(client, userdata, flags, rc):
    client.subscribe('ai_camera/events/#')

def on_message(client, userdata, msg):
    # Here you would forward to API or DB
    print('MQTT message:', msg.topic, msg.payload)

def main():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(BROKER)
    client.loop_forever()

if __name__ == '__main__':
    main()

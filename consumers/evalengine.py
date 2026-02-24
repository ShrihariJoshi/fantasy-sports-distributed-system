from kafka import KafkaConsumer
import json
from backend.db import get_connection
def evaluate_event(event):
    points_bat = 0
    points_bw = 0
    if event['event_type'] == 'BOUNDARY':
        points_bat += 4 if event['runs'] == 4 else 6
    elif event['event_type'] == 'SINGLE':
        points_bat += 1
    elif event['event_type'] == 'WICKET':
        points_bw += 10
    return points_bat, points_bw
consumer = KafkaConsumer(
    'match-events',
    bootstrap_servers='localhost:9092',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)
for message in consumer:
    event = message.value
    print(f"Received event: {event}")
    point_bat,points_bw= evaluate_event(event) 
    print(f"Points for {event['batsman']}: {point_bat}, Points for Bowler: {points_bw}")
    
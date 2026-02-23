from kafka import KafkaProducer
import json
import time

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

event = {
    "match_id": "IPL2026_01",
    "over": 1.1,
    "batsman": "Virat Kohli",
    "bowler": "Bumrah",
    "runs": 4,
    "event_type": "BOUNDARY"
}

producer.send("match-events", event)
producer.flush()

print("Event sent!")
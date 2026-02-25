from kafka import KafkaConsumer
import json
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.db import get_connection

def consume_event():
    consumer=KafkaConsumer(
        'match-players',
        bootstrap_servers='localhost:9092',
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )
    for message in consumer:
        event=message.value
        match_id=event["match_id"]
        db=get_connection()
        for player in event["team1"]["players"]:
            db.players.insert_one({
        "match_id": match_id,
        "player_name": player,
        "points": 0
    })

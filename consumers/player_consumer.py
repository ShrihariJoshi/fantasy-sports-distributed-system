from kafka import KafkaConsumer
import json
import sys
import os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.db import get_connection
import itertools
def consume_event():
    id_genetrator=itertools.count()
    consumer=KafkaConsumer(
        'player-events',
        bootstrap_servers='localhost:9092',
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )
    for message in consumer:
        event=message.value
        match_id=event["match_id"]
        db=get_connection()
        
        # NOTE: This code is REQUIRED. Without it, the `matches` database collection is empty,
        # and the frontend dashboard will display "No upcoming matches available."
        db.matches.update_one(
            {"match_id": match_id},
            {"$set": {"match_id": match_id, "title": f"Match {match_id}", "status": "active"}},
            upsert=True
        )

        for player in event["players"]:
            pid="pid"+str(next(id_genetrator))
            db.players.insert_one({
            "match_id": match_id,
            "player_name": player,
            "player_id":pid,
            "points": 0
            })
if __name__=="__main__":
    consume_event()
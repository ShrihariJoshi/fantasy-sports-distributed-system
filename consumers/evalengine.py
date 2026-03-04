from kafka import KafkaConsumer
import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.db import get_connection

def consume_event():
    consumer = KafkaConsumer(
        'match-events',
        bootstrap_servers='localhost:9092',
        value_deserializer=lambda m: json.loads(m.decode('utf-8'))
    )

    for message in consumer:
        event = message.value
        update_points(event)


def update_points(event):
    db = get_connection()
    players = db["players"]
    event_class = event.get("event_class")
    event_type = event.get("event_type")
    batsman = event.get("batsman")
    bowler = event.get("bowler")
    fielder = event.get("fielder"," ")
    runs = event.get("runs", 0)
    match_id=event.get("match_id")

    if event_class == "batting":

        if event_type == "FOUR":
            inc_player_points(players, batsman, 4 * 1.5,match_id)

        elif event_type == "SIX":
            inc_player_points(players, batsman, 6 * 2,match_id)

        elif event_type == "RUNS":
            inc_player_points(players, batsman, runs,match_id)
    elif event_class == "bowling":

        if event_type == "BOWLED":
            inc_player_points(players, bowler, 15,match_id)

        elif event_type == "CAUGHT":
            inc_player_points(players, bowler, 5,match_id)
            inc_player_points(players, fielder, 10,match_id)

        elif event_type == "RUN_OUT":
            inc_player_points(players, bowler, 2.5,match_id)
            inc_player_points(players, fielder, 12.5,match_id)

        elif event_type == "DOT":
            inc_player_points(players, bowler, 1,match_id)


def inc_player_points(collection, player_name, points,match_id):
    if not player_name:
        return
    collection.update_one(
        {
            "match_id": match_id,
            "player_name": player_name
        },
        {
            "$inc": {"points": points}
        },
        upsert=False
    )


if __name__ == "__main__":
    consume_event()
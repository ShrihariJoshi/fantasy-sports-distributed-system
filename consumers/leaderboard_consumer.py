from kafka import KafkaConsumer
import redis
import json
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.db import get_connection

r = redis.Redis(host="localhost", port=6379, decode_responses=True)


def calculate_points(event):

    event_class = event.get("event_class")
    event_type = event.get("event_type")
    runs = event.get("runs", 0)

    if event_class == "batting":

        if event_type == "FOUR":
            return 4 * 1.5

        elif event_type == "SIX":
            return 6 * 2

        elif event_type == "RUNS":
            return runs

    elif event_class == "bowling":

        if event_type == "BOWLED":
            return 15

        elif event_type == "CAUGHT":
            return 5

        elif event_type == "RUN_OUT":
            return 2.5

        elif event_type == "DOT":
            return 1

    return 0


def get_player_ids(event, match_id):

    db = get_connection()
    players = db["players"]

    player_ids = []

    for name in [event.get("batsman"), event.get("bowler"), event.get("fielder")]:
        if name:
            doc = players.find_one(
                {"match_id": match_id, "player_name": name},
                {"_id": 0, "player_id": 1}
            )

            if doc:
                player_ids.append(doc["player_id"])

    return player_ids


def update_leaderboard(match_id, player_id, points):

    teams = r.smembers(f"player_teams:{match_id}:{player_id}")

    for username in teams:

        multiplier = r.hget(f"team:{username}:{match_id}", player_id)

        if not multiplier:
            continue

        final_points = points * float(multiplier)

        r.zincrby(
            f"leaderboard:{match_id}",
            final_points,
            username
        )


def consume_event():

    consumer = KafkaConsumer(
        "match-events",
        bootstrap_servers="localhost:9092",
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )

    for message in consumer:

        event = message.value
        match_id = event.get("match_id")

        points = calculate_points(event)

        if points == 0:
            continue

        player_ids = get_player_ids(event, match_id)

        for pid in player_ids:
            update_leaderboard(match_id, pid, points)


if __name__ == "__main__":
    consume_event()
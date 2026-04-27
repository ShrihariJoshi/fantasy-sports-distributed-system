from kafka import KafkaProducer
import json
import time
import random
from itertools import count
def getKey(match_no):
    match_genrator=count()
    return "M"+str(next(match_genrator))
match_no=1
producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)


batsmen = [
    "Virat Kohli",
    "Rohit Sharma",
    "Shubman Gill",
    "KL Rahul"
]

bowlers = [
    "Josh Hazlewood",
    "Pat Cummins",
    "Mitchell Starc",
    "Kuldeep Yadav"


]

batting_events = ["FOUR", "SIX", "RUNS"]
bowling_events = ["BOWLED", "CAUGHT", "RUN_OUT", "DOT"]

over = 1
ball = 1
match_id="M1"
print("Starting Dummy Match Simulation...\n")

while over <= 2: 

    batsman = random.choice(batsmen)
    bowler = random.choice(bowlers)

    if random.random() < 0.7:
        event_type = random.choice(batting_events)
        event_class = "batting"
        runs = random.choice([1, 2, 3]) if event_type == "RUNS" else 0
    else:
        event_type = random.choice(bowling_events)
        event_class = "bowling"
        runs = 0

    event = {
        "match_id":match_id,
        "over": float(f"{over}.{ball}"),
        "batsman": batsman,
        "bowler": bowler,
        "runs": runs,
        "event_type": event_type,
        "event_class": event_class
    }

    producer.send("match-events", key=getKey(match_no).encode('utf-8'),value=event)
    producer.flush()

    print(f"Sent Event: {event}")

    time.sleep(1)  

    ball += 1
    if ball > 6:
        ball = 1
        over += 1

print("\nMatch Simulation Ended!")
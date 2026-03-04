from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

event = {
    "match_id": "M12347",
        "players": [
            "Rohit Sharma",
            "Shubman Gill",
            "Virat Kohli",
            "Shreyas Iyer",
            "KL Rahul",
            "Hardik Pandya",
            "Ravindra Jadeja",
            "Axar Patel",
            "Jasprit Bumrah",
            "Mohammed Shami",
            "Kuldeep Yadav",
            "David Warner",
            "Travis Head",
            "Steve Smith",
            "Glenn Maxwell",
            "Marcus Stoinis",
            "Josh Inglis",
            "Mitchell Marsh",
            "Pat Cummins",
            "Mitchell Starc",
            "Adam Zampa",
            "Josh Hazlewood"
        ]
}

producer.send("player-events", event)
print("sending",event)
producer.flush()

print("Squads sent successfully!")
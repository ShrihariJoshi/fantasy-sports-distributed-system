#!/bin/bash

echo "Starting Docker Services..."
sudo docker compose up -d

sleep 5

echo "Starting Player Consumer..."
gnome-terminal -- bash -c "python3 consumers/player_consumer.py; exec bash"

echo "Starting Eval Engine..."
gnome-terminal -- bash -c "python3 consumers/evalengine.py; exec bash"

sleep 2

echo "Sending Squads..."
python3 producer/player_dump.py

sleep 2

echo "Starting Match Simulation..."
python3 producer/match.py
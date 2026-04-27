#!/bin/bash
echo "Starting Player Consumer..."
gnome-terminal -- bash -c "python3 consumers/player_consumer.py; exec bash"

echo "Starting Eval Engine..."
gnome-terminal -- bash -c "python3 consumers/evalengine.py; exec bash"

echo "starting leaderboard conumer"
gnome-terminal -- bash -c "python3 consumers/leaderboard_consumer.py; exec bash"run

sleep 2

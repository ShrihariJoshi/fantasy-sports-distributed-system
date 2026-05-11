#!/bin/bash
echo "Starting Player Consumer..."
python3 consumers/player_consumer.py &

echo "Starting Eval Engine..."
python3 consumers/evalengine.py &

echo "starting leaderboard conumer"
python3 consumers/leaderboard_consumer.py &

echo "All consumers started in the background. Press Ctrl+C to stop them."
wait

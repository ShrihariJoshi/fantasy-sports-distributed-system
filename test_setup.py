#!/usr/bin/env python3
"""
Test Setup Script
Creates 5 users, 1 match, 22 players, and 5 different teams (1 per user) for testing
Run this before executing match.py in another terminal
"""

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))

from backend.db import get_connection
from werkzeug.security import generate_password_hash
import uuid

# All players available for the match
AVAILABLE_PLAYERS = [
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

MATCH_ID = "M1"
USERNAMES = ["user13", "user23", "user33", "user43", "user53"]
PASSWORD = "password123"

def create_match():
    """Create a match document in the database"""
    db = get_connection()
    matches = db["matches"]
    
    # Check if match already exists
    existing_match = matches.find_one({"match_id": MATCH_ID})
    if existing_match:
        print(f"✓ Match {MATCH_ID} already exists")
        return
    
    match_doc = {
        "match_id": MATCH_ID,
        "title": "India vs Australia",
        "status": "ongoing"
    }
    matches.insert_one(match_doc)
    print(f"✓ Created match: {MATCH_ID}")


def create_users():
    """Create 5 test users"""
    db = get_connection()
    users = db["users"]
    
    created_users = []
    for username in USERNAMES:
        # Check if user already exists
        existing_user = users.find_one({"username": username})
        if existing_user:
            print(f"✓ User '{username}' already exists")
            created_users.append(username)
            continue
        
        # Create new user
        hashed = generate_password_hash(PASSWORD)
        uid = str(uuid.uuid4())
        
        users.insert_one({
            "username": username,
            "user_id": uid,
            "password_hash": hashed
        })
        print(f"✓ Created user: {username}")
        created_users.append(username)
    
    return created_users


def insert_players():
    """Insert all players for the match"""
    db = get_connection()
    players = db["players"]
    
    # Check if players already exist
    existing_count = players.count_documents({"match_id": MATCH_ID})
    if existing_count > 0:
        print(f"✓ Players for match {MATCH_ID} already exist ({existing_count} players)")
        return
    
    # Insert players
    player_docs = []
    for player_name in AVAILABLE_PLAYERS:
        player_doc = {
            "match_id": MATCH_ID,
            "player_id": str(uuid.uuid4()),
            "player_name": player_name,
            "role": "batsman",  # Default role
            "team": "generic"
        }
        player_docs.append(player_doc)
    
    players.insert_many(player_docs)
    print(f"✓ Inserted {len(player_docs)} players for match {MATCH_ID}")


def create_teams():
    """Create 5 different teams (one for each user)"""
    db = get_connection()
    players_col = db["players"]
    teams_col = db["teams"]
    
    # Get all players for this match
    all_players = list(players_col.find(
        {"match_id": MATCH_ID},
        {"_id": 0, "player_id": 1, "player_name": 1}
    ))
    
    if not all_players or len(all_players) < 11:
        print("✗ Error: Not enough players to create teams")
        return
    
    # Team configurations - each user gets a different team
    team_configs = [
        # User 1
        {
            "users": [0],
            "captain_idx": 0,
            "vc_idx": 1,
            "normal_indices": [2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        # User 2
        {
            "users": [1],
            "captain_idx": 11,
            "vc_idx": 12,
            "normal_indices": [2, 3, 4, 5, 6, 7, 8, 9, 10]
        },
        # User 3
        {
            "users": [2],
            "captain_idx": 13,
            "vc_idx": 14,
            "normal_indices": [0, 1, 5, 6, 7, 8, 9, 10, 11]
        },
        # User 4
        {
            "users": [3],
            "captain_idx": 15,
            "vc_idx": 16,
            "normal_indices": [0, 1, 2, 3, 4, 10, 11, 12, 13]
        },
        # User 5
        {
            "users": [4],
            "captain_idx": 17,
            "vc_idx": 18,
            "normal_indices": [0, 1, 2, 3, 4, 5, 6, 11, 12]
        },
    ]
    
    # Role multipliers
    ROLE_MULTIPLIER = {
        "captain": 2,
        "vice_captain": 1.5,
        "normal": 1
    }
    
    for user_idx, username in enumerate(USERNAMES):
        # Check if team already exists
        existing_team = teams_col.find_one({
            "username": username,
            "match_id": MATCH_ID
        })
        
        if existing_team:
            print(f"✓ Team for user '{username}' already exists")
            continue
        
        config = team_configs[user_idx]
        
        # Build team
        team = []
        
        # Add captain
        captain_player = all_players[config["captain_idx"]]
        team.append({
            "player_id": captain_player["player_id"],
            "player_name": captain_player["player_name"],
            "multiplier": ROLE_MULTIPLIER["captain"],
            "points": 0
        })
        
        # Add vice captain
        vc_player = all_players[config["vc_idx"]]
        team.append({
            "player_id": vc_player["player_id"],
            "player_name": vc_player["player_name"],
            "multiplier": ROLE_MULTIPLIER["vice_captain"],
            "points": 0
        })
        
        # Add normal players
        for idx in config["normal_indices"]:
            normal_player = all_players[idx]
            team.append({
                "player_id": normal_player["player_id"],
                "player_name": normal_player["player_name"],
                "multiplier": ROLE_MULTIPLIER["normal"],
                "points": 0
            })
        
        # Insert team
        teams_col.insert_one({
            "username": username,
            "match_id": MATCH_ID,
            "team": team
        })
        
        print(f"✓ Created team for user '{username}':")
        print(f"  - Captain: {team[0]['player_name']}")
        print(f"  - Vice Captain: {team[1]['player_name']}")
        print(f"  - Players: {', '.join([p['player_name'] for p in team[2:]])}")


def main():
    """Run the complete setup"""
    print("\n" + "="*60)
    print("Fantasy Sports Test Setup")
    print("="*60 + "\n")
    
    try:
        print("Step 1: Creating match...")
        create_match()
        
        print("\nStep 2: Creating users...")
        users = create_users()
        
        print("\nStep 3: Inserting players...")
        insert_players()
        
        print("\nStep 4: Creating teams...")
        create_teams()
        
        print("\n" + "="*60)
        print("✓ Setup Complete!")
        print("="*60)
        print(f"\nMatch ID: {MATCH_ID}")
        print(f"Users: {', '.join(USERNAMES)}")
        print(f"Password for all users: {PASSWORD}")
        print("\nYou can now run 'python producer/match.py' in another terminal")
        print("to start generating match events!\n")
        
    except Exception as e:
        print(f"\n✗ Error during setup: {str(e)}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

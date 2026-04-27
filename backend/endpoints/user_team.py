from db import get_connection
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import redis

r = redis.Redis(host="localhost", port=6379, decode_responses=True)

ROLE_MULTIPLIER = {
    "captain": 2,
    "vice_captain": 1.5,
    "normal": 1
}
def add_team():

    data = request.get_json() or {}
    username = data.get("username", "").strip()
    match_id = data.get("match_id", "").strip()
    team = data.get("team", [])
    
    if not (username and match_id and team):
        return jsonify(error="missing required fields", message="username, match_id, and team are required"), 400
    
    if len(team) != 11:
        return jsonify(error="invalid team size", message="team must contain exactly 11 players"), 400
    
    captain_count = sum(1 for p in team if p.get("role") == "captain")
    vc_count = sum(1 for p in team if p.get("role") == "vice_captain")
    
    if captain_count != 1:
        return jsonify(error="invalid captain count", message="team must have exactly 1 captain"), 400
    
    if vc_count != 1:
        return jsonify(error="invalid vice captain count", message="team must have exactly 1 vice-captain"), 400
    
    db = get_connection()
    teams_col = db["teams"]
    players_col = db["players"]

    existing_team = teams_col.find_one({
        "username": username,
        "match_id": match_id
    })
    
    if existing_team:
        return jsonify(error="team already exists", message="you have already created a team for this match"), 409

    formatted_team = []
    player_names_to_roles = {}
    
    for p in team:
        player_name = p.get("player_name", "").strip()
        role = p.get("role", "").strip()
        
        if not player_name or not role:
            return jsonify(error="invalid player data", message="all players must have name and role"), 400
        
        if role not in ROLE_MULTIPLIER:
            return jsonify(error="invalid role", message=f"role must be one of: {list(ROLE_MULTIPLIER.keys())}"), 400

        player_doc = players_col.find_one(
            {"player_name": player_name, "match_id": match_id},
            {"_id": 0, "player_id": 1}
        )
        
        if not player_doc:
            return jsonify(
                error="player not found",
                message=f"player '{player_name}' not found in match {match_id}"
            ), 404
        
        pid = player_doc["player_id"]
        if pid in player_names_to_roles:
            return jsonify(error="duplicate player", message=f"player '{player_name}' appears multiple times"), 400
        
        player_names_to_roles[pid] = role
        formatted_team.append({
            "player_id": pid,
            "player_name": player_name,
            "multiplier": ROLE_MULTIPLIER[role],
            "points": 0  
        })
    
    # Insert team into database
    teams_col.insert_one({
        "username": username,
        "match_id": match_id,
        "team": formatted_team
    })
    
    for p in formatted_team:
        pid = p["player_id"]
        multiplier = p["multiplier"]
        r.sadd(f"player_teams:{match_id}:{pid}", username)
        r.hset(
            f"team:{username}:{match_id}",
            str(pid),
            multiplier
        )

    r.expire(f"player_teams:{match_id}", 7776000)
    r.expire(f"team:{username}:{match_id}", 7776000)
    
    return jsonify(message="team added successfully"), 201


def get_team_score():
    username = request.args.get("username", "").strip()
    match_id = request.args.get("match_id", "").strip()
    
    if not username or not match_id:
        return jsonify(
            error="missing parameters",
            message="username and match_id query parameters are required"
        ), 400
    
    db = get_connection()
    teams_col = db["teams"]
    players_col = db["players"]
    
    # Find user's team for this match
    user_team_doc = teams_col.find_one(
        {"username": username, "match_id": match_id},
        {"_id": 0, "team": 1}
    )
    
    if not user_team_doc:
        return jsonify(error="team not found", message="no team found for this match"), 404
    
    team = user_team_doc["team"]
    player_ids = [p["player_id"] for p in team]
    
    # Fetch current player points
    player_docs = list(players_col.find(
        {
            "match_id": match_id,
            "player_id": {"$in": player_ids}
        },
        {
            "_id": 0,
            "player_id": 1,
            "points": 1,
            "player_name": 1
        }
    ))
    
    points_map = {
        p["player_id"]: p.get("points", 0)
        for p in player_docs
    }
    
    # Calculate scores
    total_score = 0
    players_info = []
    
    for player in team:
        player_id = player["player_id"]
        base_points = points_map.get(player_id, 0)
        multiplier = player["multiplier"]
        final_points = base_points * multiplier
        
        total_score += final_points
        players_info.append({
            "player_id": player_id,
            "player_name": player.get("player_name", "Unknown"),
            "points": base_points,
            "multiplier": multiplier,
            "final_points": final_points
        })
    
    return jsonify(
        players=players_info,
        total_score=total_score
    ), 200

def get_leaderboard():
    match_id = request.args.get("match_id", "").strip()

    if not match_id:
        return jsonify(
            error="missing parameter",
            message="match_id is required"
        ), 400

    try:
        leaderboard_key = f"leaderboard:{match_id}"
        results = r.zrevrange(leaderboard_key, 0, -1, withscores=True)

        leaderboard = []
        for rank, (username, score) in enumerate(results, start=1):
            leaderboard.append({
                "rank": rank,
                "username": username,
                "score": round(score, 1)
            })

        return jsonify(leaderboard=leaderboard), 200

    except Exception as e:
        return jsonify(
            error="failed to fetch leaderboard",
            message=str(e)
        ), 500
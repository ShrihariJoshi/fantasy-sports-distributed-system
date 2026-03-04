from db import get_connection
from flask import request, jsonify
def team_handler():
    data=request.get_json() or {}
    username=data.get("username")
    match_id=data.get("match_id")
    team=data.get("team")
    db=get_connection()
    teams=db["teams"]
    players=db["players"]
    formated_team=[]
    ROLE_MULTIPLIER = {
    "captain": 2,
    "vice_captain": 1.5,
    "normal": 1
}
    for p in team:
        player_doc = players.find_one(
             {"player_name": p["player_name"]},
             {"_id": 0, "player_id": 1})

        pid = player_doc["player_id"]
        formated_team.append({
            "player_id":pid,
            "multiplier":ROLE_MULTIPLIER[p["role"]],
            "points":0
        })
    teams.insert_one({
        "username":username,
        "match_id":match_id,
        "team":formated_team
    })
    return jsonify(message="team added sucessfully"),201
from flask import request, jsonify

def get_team_score():
    username = request.args.get("username")
    matchid = request.args.get("matchid")
    if not username or not matchid:
        return jsonify({"error": "username and matchid required"}), 400
    db = get_connection()
    teams = db["teams"]
    players = db["players"]
    user_team_doc = teams.find_one(
        {"username": username, "match_id": matchid},
        {"_id": 0, "team": 1}
    )

    if not user_team_doc:
        return jsonify({"error": "team not found"}), 404

    team = user_team_doc["team"]
    player_ids = [p["player_id"] for p in team]
    player_docs = players.find(
        {
            "match_id": matchid,
            "player_id": {"$in": player_ids}
        },
        {
            "_id": 0,
            "player_id": 1,
            "points": 1
        }
    )
    points_map = {
        p["player_id"]: p["points"]
        for p in player_docs
    }

    total_score = 0
    for player in team:
        base_points = points_map.get(player["player_id"], 0)
        final_points = base_points * player["multiplier"]

        player["points"] = final_points
        total_score += final_points

    return jsonify({
        "team": team,
        "total_score": total_score
    }), 200
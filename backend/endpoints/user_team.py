from db import get_connection
from flask import request, jsonify
def team_handler():
    data = request.get_json() or {}

    team_json = data.get("team", {})
    username = data.get("username")
    matchid = data.get("matchid")
    formatted_team = {
        "captain": {"name": team_json.get("captain"), "points": 0},
        "vice_captain": {"name": team_json.get("vice_captain"), "points": 0},
        "player1": {"name": team_json.get("player1"), "points": 0},
        "player2": {"name": team_json.get("player2"), "points": 0},
        "player3": {"name": team_json.get("player3"), "points": 0},
        "player4": {"name": team_json.get("player4"), "points": 0},
        "player5": {"name": team_json.get("player5"), "points": 0},
        "player6": {"name": team_json.get("player6"), "points": 0},
        "player7": {"name": team_json.get("player7"), "points": 0},
        "player8": {"name": team_json.get("player8"), "points": 0},
        "player9": {"name": team_json.get("player9"), "points": 0},
    }

    db = get_connection()
    teams = db["teams"]

    teams.insert_one({
        "match_id": matchid,
        "username": username,
        "team": formatted_team
    })

    return jsonify(message="team added successfully"), 201
def get_team_score():
    username = request.args.get("username")
    matchid = request.args.get("matchid")
    if not username or not matchid:
        return jsonify({"error": "username and matchid required"}), 400
    db = get_connection()
    teams = db["teams"]
    res = teams.find_one(
        {"username": username, "match_id": int(matchid)},
        {"_id": 0, "team": 1}
    )
    if not res:
        return jsonify({"error": "team not found"}), 404
    return jsonify(res), 200
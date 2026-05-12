from db import get_connection
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

def get_all_players():
    matchid = request.args.get("match_id")
    db = get_connection()
    players = db["players"]
    
    try:
        all_players = list(players.find({"match_id":matchid}, {
            "_id": 0,
            "player_id": 1,
            "player_name": 1,
            "role": 1,
            "team": 1
        }))
        
        if not all_players:
            return jsonify(players=[]), 200
        
        return jsonify(players=all_players), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

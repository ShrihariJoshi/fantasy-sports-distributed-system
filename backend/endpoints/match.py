from db import get_connection
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

def get_all_matches():
    db = get_connection()
    matches = db["matches"]
    
    try:
        all_matches = list(matches.find({}, {
            "_id": 0,
            "match_id": 1,
            "title": 1,
            "status": 1
        }))
        
        if not all_matches:
            return jsonify(matches=[]), 200
        
        return jsonify(matches=all_matches), 200
    except Exception as e:
        return jsonify(error=str(e)), 500


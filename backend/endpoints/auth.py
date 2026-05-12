from db import get_connection
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify
from flask_jwt_extended import create_access_token
import uuid
''''
{
    "username":"test",
    "password":"qwert12345"
}
'''
def register_handler():
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    
    if not username or not password:
        return jsonify(message="missing fields", error="username and password are required"), 400
    
    if len(password) < 6:
        return jsonify(message="invalid password", error="password must be at least 6 characters"), 400
    
    hashed = generate_password_hash(password)
    uid = str(uuid.uuid4())
    db = get_connection()
    users = db["users"]
    existing_user = users.find_one({"username": username})
    if existing_user:
        return jsonify(message="user already exists", error="choose a different username"), 409
    
    users.insert_one({
        "username": username,
        "user_id": uid,
        "password_hash": hashed
    })
    return jsonify(message="user successfully registered"), 201

''''
{
    "username":"test",
    "password":"qwert12345"
}
'''
def login_handler():

    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    
    if not username or not password:
        return jsonify(message="missing fields", error="username and password are required"), 400
    
    db = get_connection()
    users = db["users"]
    res = users.find_one({"username": username}, {"_id": 0, "password_hash": 1})
    
    if not res:
        return jsonify(message="user not found", error="invalid credentials"), 404
    
    if not check_password_hash(res['password_hash'], password):
        return jsonify(message="invalid password", error="invalid credentials"), 401
    
    access_token = create_access_token(identity=username)
    return jsonify(
        access_token=access_token,
        username=username,
        message="login successful"
    ), 200
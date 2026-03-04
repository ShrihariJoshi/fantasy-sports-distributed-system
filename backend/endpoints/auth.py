from db import get_connection
from werkzeug.security import generate_password_hash, check_password_hash
from flask import request, jsonify
from flask_jwt_extended import create_access_token
import itertools
def register_handler():
    id_generator = itertools.count()
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")
    if not (username and password):
        return jsonify(message="missing fields"), 400
    hashed = generate_password_hash(password)
    uid="uid"+str(next(id_generator))
    db = get_connection()
    users=db["users"]
    users.insert_one({
        "username":username,
        "user_id":uid,
        "password_hash":hashed
    })
    return jsonify(message="user sucessfully registered "),201
def login_handler():
    data=request.get_json() or {}
    username= data.get("username")
    password = data.get("password")
    if not (username and password):
        return jsonify(message="missing fields"), 400
    db = get_connection()
    users=db["users"]
    res=users.find_one({"username":username},{"_id":0,"password_hash":1})
    if not res:
        return jsonify(message="user not found"),404
    if not check_password_hash(res['password_hash'],password):
        return jsonify(message="invalid password"),401
    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token),201


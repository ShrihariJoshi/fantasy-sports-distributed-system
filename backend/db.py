import os
from pymongo import MongoClient
from config import Config
def get_connection():
    MONGO_URI = Config.MONGO_URI
    client = MongoClient(MONGO_URI)
    return client['cricket_db']

from mongoengine import connect
import os

def init_db():
    try:
        client = connect(host=os.getenv("MONGODB_URL"),db=os.getenv("DB"))
        print("MongoDB connected successfully")
    except Exception as e:
        print(f"Warning: Could not connect to MongoDB: {e}")
        print("Application will continue without database functionality")
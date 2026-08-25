from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
client = MongoClient(os.getenv('MONGODB_URL'))
db = client[os.getenv('DB')]

print('=== USERS ===')
users = list(db.user.find())
print('Total users:', len(users))

for user in users:
    print(f'User: {user.get("username")} - Email: {user.get("email")} - Role: {user.get("role")}')

print('\n=== KNOWLEDGE BOTS ===')
bots = list(db.knowledgeBot.find())
print('Total bots:', len(bots))

for bot in bots:
    print(f'Bot: {bot.get("bot_name")} - ID: {str(bot.get("_id"))} - User: {bot.get("user_id")}')

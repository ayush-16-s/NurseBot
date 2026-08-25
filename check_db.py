from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
client = MongoClient(os.getenv('MONGODB_URL'))
db = client[os.getenv('DB')]

print('Collections:', db.list_collection_names())

# Check for bots
bots = list(db.knowledge_bot.find())
print('Total bots:', len(bots))

for bot in bots:
    print(f'Bot: {bot.get("name", "N/A")} - ID: {str(bot.get("_id"))} - User: {bot.get("user_id")}')

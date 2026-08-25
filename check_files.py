from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
client = MongoClient(os.getenv('MONGODB_URL'))
db = client[os.getenv('DB')]

print('=== KNOWLEDGE BOT FILES ===')
files = list(db.knowledgeBotFiles.find())
print(f'Total files in database: {len(files)}')

for file in files:
    print(f'File: {file.get("name")} - Bot ID: {file.get("chatbot_id")} - Namespace: {file.get("namespace_id")}')

print('\n=== CHECKING STK AND SA BOTS SPECIFICALLY ===')
# Get STK and SA bot info
bots = list(db.knowledgeBot.find({'bot_name': {'$in': ['STK', 'SA']}}))
for bot in bots:
    bot_id = str(bot.get('_id'))
    namespace_id = bot.get('namespace_id')
    print(f'\nBot: {bot.get("bot_name")} - ID: {bot_id} - Namespace: {namespace_id}')
    
    # Check files for this bot
    bot_files = list(db.knowledgeBotFiles.find({'chatbot_id': bot.get('_id')}))
    print(f'  Files for this bot: {len(bot_files)}')
    for file in bot_files:
        print(f'    - {file.get("name")} (Size: {file.get("size")} bytes)')
        
        # Check if file actually exists on filesystem
        from config import constants
        file_path = os.path.join(constants.UPLOAD_DIR, namespace_id, constants.PRIMARY_FOLDER, file.get("name"))
        print(f'      File path: {file_path}')
        print(f'      File exists: {os.path.exists(file_path)}')

import sys
import os

# Add the nurse_bot directory to the Python path
nurse_bot_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nurse_bot')
sys.path.insert(0, nurse_bot_path)

from models.schemas import KnowledgeBot, KnowledgeBotFiles
from bson import ObjectId
import os

# Get all bots
bots = KnowledgeBot.objects()
print('=== ALL BOTS ===')
for bot in bots:
    print(f'Bot ID: {bot.id}, Name: {bot.name}, Namespace: {bot.namespace_id}')
    
    # Get files for this bot
    files = KnowledgeBotFiles.objects(chatbot_id=bot.id)
    print(f'  Files: {files.count()}')
    for file in files:
        print(f'    - {file.name} (NS: {file.namespace_id})')
        
        # Check if file exists on disk
        file_path = os.path.join('uploads', file.namespace_id, 'primary', file.name)
        exists = os.path.exists(file_path)
        print(f'      Exists on disk: {exists}')
print()

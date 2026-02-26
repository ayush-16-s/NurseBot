# Test script to verify the delete functionality works end-to-end
# This simulates the frontend behavior

import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_delete_functionality():
    print("=== Testing Delete Functionality ===")
    
    # Step 1: Login
    login_data = {
        "email": "test@example.com",
        "password": "test123"
    }
    
    login_response = requests.post(f"{BASE_URL}/user/login", json=login_data)
    if login_response.status_code != 200:
        print(f"Login failed: {login_response.status_code}")
        return
    
    token = login_response.json()["result"]["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("Login successful")
    
    # Step 2: Get all bots (frontend fetchAllChatBots)
    bots_response = requests.get(f"{BASE_URL}/chat-bot/all", headers=headers)
    if bots_response.status_code != 200:
        print(f"Get bots failed: {bots_response.status_code}")
        return
    
    bots = bots_response.json()["result"]
    if not bots:
        print("No bots found, creating one...")
        # Create a test bot
        create_data = {
            "bot_name": "Test Patient for Delete",
            "description": "Test Description"
        }
        create_response = requests.post(f"{BASE_URL}/chat-bot", json=create_data, headers=headers)
        if create_response.status_code == 200:
            bot_id = create_response.json()["result"]["botId"]
            print(f"Created test bot with ID: {bot_id}")
            
            # Get bots again
            bots_response = requests.get(f"{BASE_URL}/chat-bot/all", headers=headers)
            bots = bots_response.json()["result"]
        else:
            print(f"Create bot failed: {create_response.status_code}")
            return
    
    if not bots:
        print("No bots to test with")
        return
    
    # Step 3: Test the data structure (frontend getBotId logic)
    first_bot = bots[0]
    print(f"\n=== Bot Data Structure ===")
    print(f"Raw bot data: {json.dumps(first_bot, indent=2)}")
    
    # Simulate frontend getBotId function
    bot_id_obj = first_bot["_id"]
    if isinstance(bot_id_obj, str):
        extracted_id = bot_id_obj
        print(f"ID is string: {extracted_id}")
    else:
        extracted_id = bot_id_obj.get("$oid")
        print(f"ID extracted from object: {extracted_id}")
    
    # Step 4: Test delete (frontend deleteChatBot)
    if extracted_id:
        print(f"\n=== Testing Delete ===")
        print(f"Attempting to delete bot with ID: {extracted_id}")
        delete_response = requests.delete(f"{BASE_URL}/chat-bot/{extracted_id}", headers=headers)
        
        if delete_response.status_code == 200:
            print("Delete successful!")
            print(f"Response: {delete_response.json()}")
        else:
            print(f"Delete failed: {delete_response.status_code}")
            print(f"Response: {delete_response.text}")
    else:
        print("Failed to extract bot ID")

if __name__ == "__main__":
    test_delete_functionality()

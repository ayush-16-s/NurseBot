# Test to simulate the exact frontend behavior
import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def test_frontend_delete():
    print("=== Testing Frontend Delete Behavior ===")
    
    # Login
    login_data = {"email": "test@example.com", "password": "test123"}
    login_response = requests.post(f"{BASE_URL}/user/login", json=login_data)
    token = login_response.json()["result"]["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Create a new bot (like frontend does)
    create_data = {"bot_name": "Test Patient Frontend", "description": "Test Description"}
    create_response = requests.post(f"{BASE_URL}/chat-bot", json=create_data, headers=headers)
    
    if create_response.status_code == 200:
        result = create_response.json()["result"]
        bot_id = result["botId"]
        namespace_id = result["namespace_id"]
        
        print(f"Created bot - ID: {bot_id}, Namespace: {namespace_id}")
        
        # Simulate frontend bot object structure
        frontend_bot = {
            "_id": {"$oid": bot_id},  # This is how API returns it
            "bot_name": "Test Patient Frontend",
            "description": "Test Description",
            "namespace_id": namespace_id,
            "created_at": {"$date": "2026-02-26T07:18:03.791Z"}
        }
        
        print(f"\nFrontend bot structure:")
        print(json.dumps(frontend_bot, indent=2))
        
        # Test the getBotId logic (JavaScript equivalent)
        def getBotId(bot):
            print(f"\nTesting getBotId with: {bot}")
            
            if not bot or not bot.get("_id"):
                print("Bot or bot._id is missing")
                return None
            
            bot_id = bot["_id"]
            print(f"bot._id: {bot_id}, type: {type(bot_id)}")
            
            if isinstance(bot_id, str):
                print("ID is string")
                return bot_id
            
            if isinstance(bot_id, dict) and "$oid" in bot_id:
                print(f"ID is object with $oid: {bot_id['$oid']}")
                return bot_id["$oid"]
            
            if isinstance(bot_id, dict) and "oid" in bot_id:
                print(f"ID is object with oid: {bot_id['oid']}")
                return bot_id["oid"]
            
            print(f"Unknown ID format: {bot_id}")
            return None
        
        extracted_id = getBotId(frontend_bot)
        print(f"\nExtracted ID: {extracted_id}")
        
        if extracted_id:
            # Test delete
            delete_response = requests.delete(f"{BASE_URL}/chat-bot/{extracted_id}", headers=headers)
            print(f"\nDelete response: {delete_response.status_code}")
            print(f"Delete body: {delete_response.text}")
        else:
            print("Failed to extract ID")

if __name__ == "__main__":
    test_frontend_delete()

import requests
import json

# Base URL
BASE_URL = "http://127.0.0.1:8000"

def test_register_and_delete():
    # Try to register a new user first
    register_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "test123",
        "phone_number": 1234567890,
        "company_name": "Test Company"
    }
    
    print("Testing registration...")
    register_response = requests.post(f"{BASE_URL}/user/register", json=register_data)
    print(f"Register response status: {register_response.status_code}")
    print(f"Register response: {register_response.text}")
    
    # Now try to login
    login_data = {
        "email": "test@example.com",
        "password": "test123"
    }
    
    print("Testing login...")
    login_response = requests.post(f"{BASE_URL}/user/login", json=login_data)
    
    if login_response.status_code == 200:
        login_result = login_response.json()
        token = login_result.get("result", {}).get("token")
        print(f"Login successful! Token: {token[:50]}...")
        
        # Get all bots
        headers = {"Authorization": f"Bearer {token}"}
        bots_response = requests.get(f"{BASE_URL}/chat-bot/all", headers=headers)
        
        if bots_response.status_code == 200:
            bots = bots_response.json()
            print(f"Found {len(bots.get('result', []))} bots")
            
            if bots.get('result'):
                # Try to delete the first bot
                first_bot = bots['result'][0]
                bot_id = first_bot['_id']['$oid']
                print(f"Attempting to delete bot: {first_bot['bot_name']} (ID: {bot_id})")
                
                delete_response = requests.delete(f"{BASE_URL}/chat-bot/{bot_id}", headers=headers)
                print(f"Delete response status: {delete_response.status_code}")
                print(f"Delete response: {delete_response.text}")
            else:
                print("No bots to delete. Creating a test bot first...")
                
                # Create a test bot
                create_data = {
                    "bot_name": "Test Patient for Delete",
                    "description": "This is a test patient for delete functionality"
                }
                
                create_response = requests.post(f"{BASE_URL}/chat-bot", json=create_data, headers=headers)
                print(f"Create bot response: {create_response.status_code}")
                print(f"Create bot response: {create_response.text}")
                
                if create_response.status_code == 200:
                    # Now try to delete it
                    create_result = create_response.json()
                    bot_id = create_result.get("botId")
                    if bot_id:
                        print(f"Attempting to delete newly created bot (ID: {bot_id})")
                        delete_response = requests.delete(f"{BASE_URL}/chat-bot/{bot_id}", headers=headers)
                        print(f"Delete response status: {delete_response.status_code}")
                        print(f"Delete response: {delete_response.text}")
        else:
            print(f"Failed to get bots: {bots_response.status_code}")
            print(f"Response: {bots_response.text}")
    else:
        print(f"Login failed: {login_response.status_code}")
        print(f"Response: {login_response.text}")

if __name__ == "__main__":
    test_register_and_delete()

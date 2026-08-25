import asyncio
import os
from dotenv import load_dotenv
from config.mongodb import init_db
from services.user_service import UserQueries
from models.dto import UserLogin

async def test_all_new_users():
    load_dotenv()
    init_db()
    uq = UserQueries()
    
    # Test credentials for all newly created users
    test_credentials = [
        {"email": "john.doe@example.com", "password": "john123"},
        {"email": "jane.smith@example.com", "password": "jane123"},
        {"email": "test.user@example.com", "password": "test123"},
        {"email": "admin@nursebot.com", "password": "admin123"}
    ]
    
    print("=== Testing Login for All Users ===")
    for creds in test_credentials:
        print(f"\nTesting: {creds['email']}")
        login_data = UserLogin(**creds)
        result = await uq.login(login_data)
        
        if hasattr(result, 'body'):
            import json
            body = json.loads(result.body.decode())
            if 'token' in body.get('result', {}):
                print(f"[SUCCESS] Login successful! Token generated.")
            else:
                print(f"[FAILED] Login failed: {body.get('message', 'Unknown error')}")
        else:
            print(f"[FAILED] Login result: {result}")

if __name__ == "__main__":
    asyncio.run(test_all_new_users())

import asyncio
import os
from dotenv import load_dotenv
from config.mongodb import init_db
from services.user_service import UserQueries
from models.dto import UserRegister

async def create_test_users():
    load_dotenv()
    init_db()
    uq = UserQueries()
    
    # List of test users to create
    test_users = [
        {
            "email": "john.doe@example.com",
            "password": "john123",
            "name": "John Doe",
            "phone_number": 9876543210,
            "company_name": "ABC Healthcare"
        },
        {
            "email": "jane.smith@example.com", 
            "password": "jane123",
            "name": "Jane Smith",
            "phone_number": 9876543211,
            "company_name": "XYZ Medical"
        },
        {
            "email": "test.user@example.com",
            "password": "test123", 
            "name": "Test User",
            "phone_number": 9876543212,
            "company_name": "Test Clinic"
        }
    ]
    
    print("=== Creating Test Users ===")
    for user_data in test_users:
        register_data = UserRegister(**user_data)
        result = await uq.register_user(register_data)
        
        if hasattr(result, 'body'):
            import json
            body = json.loads(result.body.decode())
            print(f"User {user_data['email']}: {body.get('message', 'Unknown')}")
        else:
            print(f"User {user_data['email']}: {result}")
    
    print("\n=== Test Users Created ===")
    print("You can now login with these credentials:")
    for user_data in test_users:
        print(f"Email: {user_data['email']}, Password: {user_data['password']}")

if __name__ == "__main__":
    asyncio.run(create_test_users())

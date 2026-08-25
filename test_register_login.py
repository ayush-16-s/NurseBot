import asyncio
import os
from dotenv import load_dotenv
from config.mongodb import init_db
from services.user_service import UserQueries
from models.dto import UserRegister, UserLogin

async def test_register_login():
    load_dotenv()
    init_db()
    uq = UserQueries()
    
    # Test user registration
    print("=== Testing Registration ===")
    register_data = UserRegister(
        email="newuser@test.com",
        password="testpass123",
        name="Test User",
        phone_number=1234567890,
        company_name="Test Company"
    )
    
    register_result = await uq.register_user(register_data)
    print("Registration result:", register_result)
    
    # Test login with new user
    print("\n=== Testing Login ===")
    login_data = UserLogin(email="newuser@test.com", password="testpass123")
    login_result = await uq.login(login_data)
    
    if hasattr(login_result, 'body'):
        import json
        body = json.loads(login_result.body.decode())
        print("Login successful!")
        print("Response body:", body)
        print("Token:", body.get('result', {}).get('token', 'No token'))
    else:
        print("Login result:", login_result)

if __name__ == "__main__":
    asyncio.run(test_register_login())

import asyncio
import os
from dotenv import load_dotenv
from config.mongodb import init_db
from services.user_service import UserQueries
from models.dto import UserLogin

async def test_login():
    load_dotenv()
    init_db()
    uq = UserQueries()
    
    # Test with admin user that works
    login_data = UserLogin(email='admin@nursebot.com', password='admin123')
    result = await uq.login(login_data)
    print("Login result type:", type(result))
    print("Login result:", result)
    
    # Try to access the response content
    if hasattr(result, 'body'):
        import json
        body = json.loads(result.body.decode())
        print("Response body:", body)
        print("Token:", body.get('result', {}).get('token', 'No token'))

if __name__ == "__main__":
    asyncio.run(test_login())

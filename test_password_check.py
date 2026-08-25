import os
from dotenv import load_dotenv
from config.mongodb import init_db
from models.schemas import User

def test_password_check():
    load_dotenv()
    init_db()
    
    user = User.objects(email='ayushsonkusare1602@gmail.com').first()
    if user:
        print(f"User found: {user.email}")
        print(f"Password hash: {user.password}")
        
        # Test different passwords
        test_passwords = ['test123', 'password', '123456', 'ayush']
        for pwd in test_passwords:
            is_valid = user.check_password(pwd)
            print(f"Password '{pwd}': {is_valid}")
    else:
        print("User not found")

if __name__ == "__main__":
    test_password_check()

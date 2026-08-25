import os
from dotenv import load_dotenv
from config.mongodb import init_db
from models.schemas import User

def test_super_admin():
    load_dotenv()
    init_db()
    
    user = User.objects(email='admin@nursebot.com').first()
    if user:
        print(f"Admin found: {user.email}")
        print(f"Password hash: {user.password}")
        
        # Test common passwords
        test_passwords = ['admin123', 'admin', 'password', '123456', 'superadmin', 'admin@nursebot.com']
        for pwd in test_passwords:
            is_valid = user.check_password(pwd)
            print(f"Password '{pwd}': {is_valid}")
    else:
        print("Admin not found")

if __name__ == "__main__":
    test_super_admin()

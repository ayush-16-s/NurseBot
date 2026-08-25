import bcrypt
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

# Connect to MongoDB
client = MongoClient(os.getenv('MONGODB_URL'))
db = client[os.getenv('DB')]

# Update password for ayushsonkusare1601@gmail.com using bcrypt
user_email = 'ayushsonkusare1601@gmail.com'
new_password = 'Admin@1234'

# Generate bcrypt hash
hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

print(f'Generated hash: {hashed_password}')

# Update the user
result = db.user.update_one(
    {'email': user_email},
    {'$set': {'password': hashed_password}}
)

if result.modified_count > 0:
    print(f'Password updated successfully for {user_email}')
    print(f'New password: {new_password}')
    print('You can now login with this password!')
else:
    print(f'User {user_email} not found or password not updated')

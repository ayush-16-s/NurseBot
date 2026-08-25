from pymongo import MongoClient
import os
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash

load_dotenv()

# Connect to MongoDB
client = MongoClient(os.getenv('MONGODB_URL'))
db = client[os.getenv('DB')]

# Update password for ayushsonkusare1601@gmail.com
user_email = 'ayushsonkusare1601@gmail.com'
new_password = 'Admin@1234'  # You can change this

# Generate hashed password
hashed_password = generate_password_hash(new_password, method='pbkdf2:sha256')

# Update the user
result = db.user.update_one(
    {'email': user_email},
    {'$set': {'password': hashed_password}}
)

if result.modified_count > 0:
    print(f'Password updated successfully for {user_email}')
    print(f'New password: {new_password}')
else:
    print(f'User {user_email} not found or password not updated')

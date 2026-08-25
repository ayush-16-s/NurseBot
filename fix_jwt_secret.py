import os
from dotenv import load_dotenv, set_key

# Load current .env
load_dotenv()

# Update JWT secret to be more secure
env_file = '.env'
new_secret = "your-super-secret-jwt-key-for-nursebot-app-32-chars-minimum"

# Update the .env file
set_key(env_file, 'JWT_SECRET', new_secret)
print(f"JWT_SECRET updated to: {new_secret}")
print("Please restart the server to apply the changes.")

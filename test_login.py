import requests
import json

# Test login endpoint
url = "http://localhost:9000/user/login"
headers = {"Content-Type": "application/json"}

# Test users
test_users = [
    {
        "email": "test.user@example.com",
        "password": "test123"
    },
    {
        "email": "john.doe@example.com", 
        "password": "john123"
    },
    {
        "email": "jane.smith@example.com",
        "password": "jane123"
    }
]

for i, user_data in enumerate(test_users, 1):
    print(f"\n=== Testing User {i}: {user_data['email']} ===")
    try:
        response = requests.post(url, headers=headers, json=user_data)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            if result.get('result'):
                print("SUCCESS: Login successful!")
                token = result.get('result', {}).get('token', 'No token found')
                print(f"Token (first 20 chars): {token[:20]}...")
            else:
                print("FAILED: Login failed:", result.get('message', 'Unknown error'))
        else:
            print("FAILED: HTTP Error:", response.status_code)
            print(f"Response: {response.text}")
            
    except Exception as e:
        print(f"ERROR: {e}")

print("\n=== Test Summary ===")
print("You can now use these credentials in your frontend:")
for user_data in test_users:
    print(f"Email: {user_data['email']}, Password: {user_data['password']}")

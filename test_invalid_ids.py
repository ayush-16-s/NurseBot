import requests

BASE_URL = "http://127.0.0.1:8000"

def test_invalid_ids():
    print("=== Testing Invalid ID Handling ===")
    
    # Login first
    login_data = {"email": "test@example.com", "password": "test123"}
    login_response = requests.post(f"{BASE_URL}/user/login", json=login_data)
    token = login_response.json()["result"]["token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # Test 1: undefined ID
    print("\n1. Testing 'undefined' ID:")
    response = requests.delete(f"{BASE_URL}/chat-bot/undefined", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test 2: null ID
    print("\n2. Testing 'null' ID:")
    response = requests.delete(f"{BASE_URL}/chat-bot/null", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test 3: empty string
    print("\n3. Testing empty string ID:")
    response = requests.delete(f"{BASE_URL}/chat-bot/", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")
    
    # Test 4: invalid ObjectId format
    print("\n4. Testing invalid ObjectId format:")
    response = requests.delete(f"{BASE_URL}/chat-bot/invalid", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.text}")

if __name__ == "__main__":
    test_invalid_ids()

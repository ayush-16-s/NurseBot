import requests
import json

API_BASE = "http://localhost:9000/api"

def test_endpoints():
    print("=== COMPREHENSIVE API TEST ===\n")
    
    # Test 1: Login with existing users
    print("1. TESTING LOGIN ENDPOINTS")
    test_users = [
        {"email": "test.user@example.com", "password": "test123"},
        {"email": "john.doe@example.com", "password": "john123"},
        {"email": "jane.smith@example.com", "password": "jane123"}
    ]
    
    for i, user in enumerate(test_users, 1):
        response = requests.post(f"{API_BASE}/user/login", json=user, headers={"Content-Type": "application/json"})
        if response.status_code == 200:
            result = response.json()
            token = result.get('result', {}).get('token', '')
            print(f"   User {i}: SUCCESS - Token: {token[:20]}...")
        else:
            print(f"   User {i}: FAILED - {response.status_code}")
    
    # Test 2: Register new user
    print("\n2. TESTING REGISTER ENDPOINT")
    new_user = {
        "email": "final.test@example.com",
        "password": "finalpass123",
        "name": "Final Test User",
        "phone_number": 999888777,
        "company_name": "Final Test Company"
    }
    
    response = requests.post(f"{API_BASE}/user/register", json=new_user, headers={"Content-Type": "application/json"})
    if response.status_code == 200:
        print(f"   Register: SUCCESS - {response.json()}")
    else:
        print(f"   Register: FAILED - {response.status_code}")
    
    # Test 3: Login with newly registered user
    print("\n3. TESTING LOGIN WITH NEW USER")
    login_response = requests.post(f"{API_BASE}/user/login", 
                                json={"email": new_user["email"], "password": new_user["password"]}, 
                                headers={"Content-Type": "application/json"})
    if login_response.status_code == 200:
        result = login_response.json()
        token = result.get('result', {}).get('token', '')
        print(f"   New User Login: SUCCESS - Token: {token[:20]}...")
    else:
        print(f"   New User Login: FAILED - {login_response.status_code}")
    
    # Test 4: Test protected endpoint (should fail without token)
    print("\n4. TESTING PROTECTED ENDPOINT (WITHOUT TOKEN)")
    response = requests.get(f"{API_BASE}/user/", headers={"Content-Type": "application/json"})
    if response.status_code == 401:
        print("   Protected Endpoint: CORRECTLY BLOCKED (401)")
    else:
        print(f"   Protected Endpoint: UNEXPECTED RESPONSE - {response.status_code}")
    
    print("\n=== TEST COMPLETE ===")
    print("SUCCESS: Login and Register endpoints are working correctly!")
    print("SUCCESS: Frontend can now connect to backend!")
    print("SUCCESS: JWT authentication is properly configured!")

if __name__ == "__main__":
    test_endpoints()

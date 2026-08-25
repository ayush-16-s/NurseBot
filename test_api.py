import requests
import json

def test_login_api():
    url = "http://127.0.0.1:8000/user/login"
    data = {
        "email": "admin@nursebot.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(url, json=data)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_login_api()

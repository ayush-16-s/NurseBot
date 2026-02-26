#!/usr/bin/env python3
"""
Test script to simulate diabetes analysis request
"""

import requests
import json

# Test the diabetes analysis endpoint
def test_diabetes_analysis():
    """Test the diabetes analysis with a sample namespace"""
    
    # You'll need to replace this with an actual namespace_id from your 3rd bot
    # For now, let's try with a sample namespace
    test_namespace = "test-namespace-123"  # Replace with actual 3rd bot namespace
    
    url = "http://127.0.0.1:9000/files/diabetes-analysis"
    
    payload = {
        "namespace_id": test_namespace
    }
    
    headers = {
        "Content-Type": "application/json"
    }
    
    print(f"Testing diabetes analysis with namespace: {test_namespace}")
    print(f"URL: {url}")
    print(f"Payload: {json.dumps(payload, indent=2)}")
    
    try:
        response = requests.post(url, json=payload, headers=headers)
        
        print(f"\nResponse Status: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        try:
            response_json = response.json()
            print(f"Response Body:\n{json.dumps(response_json, indent=2)}")
        except:
            print(f"Response Body (raw): {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("ERROR: Could not connect to the server. Make sure the backend is running on port 9000")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    test_diabetes_analysis()

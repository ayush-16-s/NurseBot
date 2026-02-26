#!/usr/bin/env python3
"""
Test script to verify glucose extraction patterns
"""

import sys
import os

# Add the nurse_bot directory to the Python path
nurse_bot_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'nurse_bot')
sys.path.insert(0, nurse_bot_path)

from services.diabetes_analysis_service import DiabetesAnalysisService

def test_glucose_extraction():
    """Test glucose extraction with various medical report formats"""
    
    service = DiabetesAnalysisService()
    
    # Test cases with different glucose value formats
    test_cases = [
        {
            "name": "Standard fasting glucose",
            "text": "Fasting Glucose: 110 mg/dL",
            "expected_fasting": [110.0]
        },
        {
            "name": "HbA1c format",
            "text": "HbA1c: 6.5%",
            "expected_hba1c": [6.5]
        },
        {
            "name": "Post-meal glucose",
            "text": "Post Meal Glucose - 145 mg/dl",
            "expected_post_meal": [145.0]
        },
        {
            "name": "Random glucose",
            "text": "Random Blood Sugar: 135 mg/dL",
            "expected_random": [135.0]
        },
        {
            "name": "General glucose format",
            "text": "Glucose: 95 mg/dL",
            "expected_general": [95.0]
        },
        {
            "name": "Complex medical report",
            "text": """
            Patient Lab Results
            ===================
            Fasting Glucose: 125 mg/dL
            HbA1c: 6.8%
            Post Meal Glucose: 180 mg/dL
            Random Glucose: 150 mg/dL
            Blood Sugar: 140 mg/dL
            """,
            "expected_fasting": [125.0],
            "expected_hba1c": [6.8],
            "expected_post_meal": [180.0],
            "expected_random": [150.0],
            "expected_general": [140.0]
        }
    ]
    
    print("Testing Glucose Extraction Patterns")
    print("=" * 50)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\nTest {i}: {test_case['name']}")
        print(f"Input text: {repr(test_case['text'])}")
        
        result = service.extract_glucose_values(test_case['text'])
        
        print(f"Extracted values: {result}")
        
        # Check expectations
        success = True
        if 'expected_fasting' in test_case:
            if result['fasting_glucose'] != test_case['expected_fasting']:
                print(f"FAIL: Fasting glucose mismatch. Expected: {test_case['expected_fasting']}, Got: {result['fasting_glucose']}")
                success = False
            else:
                print(f"PASS: Fasting glucose correct: {result['fasting_glucose']}")
                
        if 'expected_hba1c' in test_case:
            if result['hba1c'] != test_case['expected_hba1c']:
                print(f"FAIL: HbA1c mismatch. Expected: {test_case['expected_hba1c']}, Got: {result['hba1c']}")
                success = False
            else:
                print(f"PASS: HbA1c correct: {result['hba1c']}")
                
        if 'expected_post_meal' in test_case:
            if result['post_meal_glucose'] != test_case['expected_post_meal']:
                print(f"FAIL: Post-meal glucose mismatch. Expected: {test_case['expected_post_meal']}, Got: {result['post_meal_glucose']}")
                success = False
            else:
                print(f"PASS: Post-meal glucose correct: {result['post_meal_glucose']}")
                
        if 'expected_random' in test_case:
            if result['random_glucose'] != test_case['expected_random']:
                print(f"FAIL: Random glucose mismatch. Expected: {test_case['expected_random']}, Got: {result['random_glucose']}")
                success = False
            else:
                print(f"PASS: Random glucose correct: {result['random_glucose']}")
                
        if 'expected_general' in test_case:
            if result['general_glucose'] != test_case['expected_general']:
                print(f"FAIL: General glucose mismatch. Expected: {test_case['expected_general']}, Got: {result['general_glucose']}")
                success = False
            else:
                print(f"PASS: General glucose correct: {result['general_glucose']}")
        
        if success:
            print("PASS: All tests passed for this case!")
        else:
            print("FAIL: Some tests failed for this case")
    
    print("\n" + "=" * 50)
    print("Testing completed!")

if __name__ == "__main__":
    test_glucose_extraction()

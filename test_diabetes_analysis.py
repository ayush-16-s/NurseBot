#!/usr/bin/env python3
"""
Test script for diabetes analysis service
"""
import asyncio
import sys
import os

# Add the project root to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.diabetes_analysis_service import DiabetesAnalysisService

async def test_diabetes_analysis():
    """Test the diabetes analysis service with sample data"""
    
    # Create service instance
    service = DiabetesAnalysisService()
    
    # Test with sample text containing glucose values
    sample_text = """
    Patient Glucose Report
    ====================
    
    Fasting Glucose: 110 mg/dL
    Post-meal Glucose: 165 mg/dL
    Random Glucose: 140 mg/dL
    HbA1c: 6.8%
    
    Additional Notes:
    Patient shows elevated blood sugar levels.
    """
    
    print("Testing Diabetes Analysis Service")
    print("=" * 50)
    
    # Test glucose extraction
    extracted_values = service.extract_glucose_values(sample_text)
    print("1. Extracted Glucose Values:")
    for key, values in extracted_values.items():
        if values:
            print(f"   {key}: {values}")
    
    # Test pattern analysis
    analysis = service.analyze_glucose_pattern(extracted_values)
    print("\n2. Analysis Results:")
    print(f"   Diabetes Status: {analysis.get('diabetes_status', 'Unknown')}")
    print(f"   Diabetes Type: {analysis.get('diabetes_type', 'Unknown')}")
    print(f"   Risk Level: {analysis.get('risk_level', 'Unknown')}")
    print(f"   Key Findings: {analysis.get('key_findings', [])}")
    
    # Test recommendations
    print("\n3. Recommendations:")
    for i, rec in enumerate(analysis.get('recommendations', []), 1):
        print(f"   {i}. {rec}")
    
    print("\n4. Follow-up Suggestions:")
    suggestions = service.get_follow_up_suggestions()
    for i, suggestion in enumerate(suggestions, 1):
        print(f"   {i}. {suggestion}")
    
    print("\n" + "=" * 50)
    print("Test completed successfully!")
    
    return True

if __name__ == "__main__":
    asyncio.run(test_diabetes_analysis())

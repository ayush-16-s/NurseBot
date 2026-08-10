#!/usr/bin/env python3
"""
Test script to verify diabetes analysis functionality
"""

import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from services.pinecone_service import PineconeService
from dotenv import load_dotenv
load_dotenv()

async def test_analysis():
    """Test the diabetes analysis functionality"""
    
    # Test namespace (use a real one from your system)
    test_namespace = "test-namespace-12345"
    
    print("🔍 Testing Diabetes Analysis System...")
    print(f"📍 Using namespace: {test_namespace}")
    
    # Initialize service
    service = PineconeService()
    
    # Test 1: Check if service initializes
    try:
        print("✅ Service initialized successfully")
    except Exception as e:
        print(f"❌ Service initialization failed: {e}")
        return
    
    # Test 2: Try to vectorize a test document
    print("\n📄 Testing document vectorization...")
    try:
        # Create a test document
        test_dir = f"test_uploads/{test_namespace}"
        os.makedirs(test_dir, exist_ok=True)
        
        # Create a simple test file
        test_file = f"{test_dir}/test_glucose_report.txt"
        with open(test_file, 'w') as f:
            f.write("""
            Patient Glucose Report
            
            Fasting Blood Sugar: 95 mg/dL
            Post-meal Blood Sugar: 145 mg/dL  
            HbA1c: 6.8%
            
            Diagnosis: Type 2 Diabetes
            Medication: Metformin 500mg twice daily
            Diet: Low carbohydrate, high fiber
            Exercise: 30 minutes walking daily
            """)
        
        # Test vectorization
        result = await service.vectorize_documents_main(test_namespace)
        print(f"📊 Vectorization result: {result}")
        
        if "error" in result:
            print("❌ Vectorization failed")
        else:
            print("✅ Vectorization successful")
            
    except Exception as e:
        print(f"❌ Vectorization test failed: {e}")
    
    # Test 3: Test analysis query
    print("\n🤖 Testing analysis query...")
    try:
        analysis_generator = service.chain_resp(
            namespace_id=test_namespace,
            question="Please analyze my glucose report and provide detailed insights about my diabetes condition",
            chatHistory=""
        )
        
        # Collect response
        response_chunks = []
        async for chunk in analysis_generator:
            response_chunks.append(chunk)
            print(f"📝 Analysis chunk: {chunk[:50]}...")
        
        full_response = "".join(response_chunks)
        print(f"📋 Full analysis response: {full_response[:200]}...")
        
        # Check if analysis worked
        if "couldn't analyze" in full_response.lower():
            print("❌ Analysis failed - generic error response")
        elif "glucose" in full_response.lower() or "diabetes" in full_response.lower():
            print("✅ Analysis successful - contains diabetes-related content")
        else:
            print("⚠️ Analysis unclear - no diabetes content found")
            
    except Exception as e:
        print(f"❌ Analysis test failed: {e}")
    
    # Test 4: Cleanup
    print("\n🧹 Cleaning up test files...")
    try:
        import shutil
        if os.path.exists("test_uploads"):
            shutil.rmtree("test_uploads")
            print("✅ Test cleanup completed")
    except Exception as e:
        print(f"❌ Cleanup failed: {e}")
    
    print("\n🎯 Test completed! Check the output above to diagnose issues.")

if __name__ == "__main__":
    import asyncio
    asyncio.run(test_analysis())

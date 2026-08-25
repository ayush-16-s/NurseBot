#!/usr/bin/env python3
"""Test script to debug PDF text extraction for Sonkusare R.pdf"""

import sys
sys.path.insert(0, 'C:/Users/VICTUS/Desktop/NURSEBOT/nurse_bot')

import os

# Test file
namespace_id = "5599939c-aaa2-44f8-acd7-e647cc94db87"
file_path = f"upload/{namespace_id}/uploaded-file/Sonkusare R.pdf"

print(f"Testing PDF extraction: {file_path}")
print(f"File exists: {os.path.exists(file_path)}")

if os.path.exists(file_path):
    try:
        # Try PyMuPDFLoader directly
        from langchain_community.document_loaders import PyMuPDFLoader
        print("\n--- Testing PyMuPDFLoader ---")
        loader = PyMuPDFLoader(file_path)
        documents = loader.load()
        print(f"Documents loaded: {len(documents)}")
        
        if documents:
            for i, doc in enumerate(documents):
                print(f"\n--- Document {i+1} ---")
                print(f"Metadata: {doc.metadata}")
                print(f"Content length: {len(doc.page_content)}")
                print(f"First 500 chars: {doc.page_content[:500]}")
        else:
            print("\nNo documents loaded - trying PyPDFLoader as fallback...")
            from langchain_community.document_loaders import PyPDFLoader
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            print(f"PyPDFLoader documents: {len(documents)}")
            
            if documents:
                for i, doc in enumerate(documents):
                    print(f"\n--- Document {i+1} ---")
                    print(f"Metadata: {doc.metadata}")
                    print(f"Content length: {len(doc.page_content)}")
                    print(f"First 500 chars: {doc.page_content[:500]}")
        
        if not documents:
            print("\n\n*** Both loaders failed to extract text ***")
            print("This PDF may be:")
            print("1. A scanned image-based PDF (needs OCR)")
            print("2. Password protected")
            print("3. Corrupted or malformed")
            
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        print(traceback.format_exc())
else:
    print("File not found!")

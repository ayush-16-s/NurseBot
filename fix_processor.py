#!/usr/bin/env python3
"""Fix parse_pdf to handle image-based PDFs with OCR"""

import re

with open('utils/processor.py', 'r') as f:
    content = f.read()

# Find the parse_pdf function and replace it
old_func = '''def parse_pdf(file_path: str) -> list:



    # loader = PyPDFLoader(file_path)



    # documents = loader.load()



    # file_name = file_path.split("\\\\")[-1]



    # text_splitter = RecursiveCharacterTextSplitter(



    #     chunk_size=700, chunk_overlap=100, separators=["\\n", " ", ""])



    # docs = text_splitter.split_documents(documents)



    



    # for idx, text in enumerate(docs):



    #             docs[idx].metadata['name']=file_name



    #             docs[idx].metadata['type']='pdf'



    



    # print(f"\\t Total documents created: {len(docs)}",docs)



    # return docs



    



    loader = PyMuPDFLoader(file_path)



    documents = loader.load() 



    file_name = re.search(r'[^/]+$', file_path).group(0)



    text_splitter = RecursiveCharacterTextSplitter(



        chunk_size=500, chunk_overlap=100, separators=["\\n", " ", ""])



    docs = text_splitter.split_documents(documents) 



    for idx, text in enumerate(docs):



                docs[idx].metadata['name']=file_name



                docs[idx].metadata['type']='pdf'



    # print(f"\\t Total documents created: {len(docs)}")



    return docs'''

new_func = '''def parse_pdf(file_path: str) -> list:
    """Parse PDF with fallback to OCR for image-based PDFs"""
    
    # First try PyMuPDFLoader
    try:
        loader = PyMuPDFLoader(file_path)
        documents = loader.load()
        
        # Check if any content was extracted
        has_content = any(len(doc.page_content.strip()) > 0 for doc in documents)
        
        if has_content:
            file_name = re.search(r'[^/]+$', file_path).group(0)
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500, chunk_overlap=100, separators=["\\n", " ", ""])
            docs = text_splitter.split_documents(documents)
            
            for idx, text in enumerate(docs):
                docs[idx].metadata['name'] = file_name
                docs[idx].metadata['type'] = 'pdf'
            
            return docs
        else:
            print(f"DEBUG: No text content found in {file_path}, attempting OCR...")
    except Exception as e:
        print(f"DEBUG: PyMuPDFLoader failed: {e}")
        documents = []
    
    # Fallback: Try OCR for image-based PDFs
    try:
        import pytesseract
        from PIL import Image
        import fitz  # PyMuPDF
        
        print(f"DEBUG: Attempting OCR extraction for {file_path}")
        
        # Open PDF with PyMuPDF
        doc = fitz.open(file_path)
        ocr_text = ""
        
        for page_num in range(len(doc)):
            page = doc[page_num]
            # Render page to image
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))  # 2x zoom for better OCR
            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
            
            # OCR the image
            text = pytesseract.image_to_string(img)
            ocr_text += f"\\n--- Page {page_num + 1} ---\\n{text}"
        
        doc.close()
        
        if ocr_text.strip():
            print(f"DEBUG: OCR extracted {len(ocr_text)} characters")
            file_name = re.search(r'[^/]+$', file_path).group(0)
            
            # Create a document from OCR text
            from langchain_core.documents import Document
            docs = [Document(
                page_content=ocr_text,
                metadata={'name': file_name, 'type': 'pdf', 'source': 'ocr'}
            )]
            return docs
        else:
            print("DEBUG: OCR also returned no text")
            
    except ImportError:
        print("DEBUG: OCR libraries not available (pytesseract, PyMuPDF)")
    except Exception as e:
        print(f"DEBUG: OCR failed: {e}")
    
    # Final fallback: Return empty document with warning
    print(f"WARNING: Could not extract text from {file_path}")
    return []'''

if old_func in content:
    content = content.replace(old_func, new_func)
    with open('utils/processor.py', 'w') as f:
        f.write(content)
    print('parse_pdf function updated successfully with OCR support')
else:
    print('Could not find exact match, trying simpler approach...')
    # Try to find just the function start
    import re as regex
    pattern = r'def parse_pdf\(file_path: str\) -> list:.*?return docs'
    match = regex.search(pattern, content, regex.DOTALL)
    if match:
        content = content.replace(match.group(), new_func)
        with open('utils/processor.py', 'w') as f:
            f.write(content)
        print('parse_pdf function updated with regex')
    else:
        print('Could not find parse_pdf function')

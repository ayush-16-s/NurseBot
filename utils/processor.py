from langchain_text_splitters import RecursiveCharacterTextSplitter



from langchain_community.document_loaders import PyMuPDFLoader,TextLoader



from langchain_community.document_loaders import PyPDFLoader



import re







def parse_pdf(file_path: str) -> list:
    """Parse PDF with fallback to OCR for image-based PDFs"""
    
    # Configure Tesseract path for Windows (if needed)
    try:
        import pytesseract
        from pathlib import Path
        # Common Tesseract installation paths on Windows
        tesseract_paths = [
            r'C:\Program Files\Tesseract-OCR\tesseract.exe',
            r'C:\Program Files (x86)\Tesseract-OCR\tesseract.exe',
        ]
        for path in tesseract_paths:
            if Path(path).exists():
                pytesseract.pytesseract.tesseract_cmd = path
                print(f"DEBUG: Found Tesseract at {path}")
                break
    except ImportError:
        pass
    
    # First try PyMuPDFLoader
    try:
        loader = PyMuPDFLoader(file_path)
        documents = loader.load()
        
        # Check if any content was extracted
        has_content = any(len(doc.page_content.strip()) > 0 for doc in documents)
        
        if has_content:
            file_name = re.search(r'[^/]+$', file_path).group(0)
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=500, chunk_overlap=100, separators=["\n", " ", ""])
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
            ocr_text += f"\n--- Page {page_num + 1} ---\n{text}"
        
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
    return []



    



    loader = PyMuPDFLoader(file_path)



    documents = loader.load() 



    file_name = re.search(r'[^/]+$', file_path).group(0)



    text_splitter = RecursiveCharacterTextSplitter(



        chunk_size=500, chunk_overlap=100, separators=["\n", " ", ""])



    docs = text_splitter.split_documents(documents) 



    for idx, text in enumerate(docs):



                docs[idx].metadata['name']=file_name



                docs[idx].metadata['type']='pdf'







    # print(f"\t Total documents created: {len(docs)}",docs)



    return docs







def parse_text(file_path: str) -> list:



    file_data = open(file_path, 'r', encoding='utf-8')



    file_content = file_data.read()



    # print(f"\t Reading a file: {file_path}\n\t Length of the File: {len(file_content)}")



    file_name = file_path.split("\\")[-1]



    text_splitter = RecursiveCharacterTextSplitter(



        chunk_size=700,



        chunk_overlap=100,



        length_function=len



    )



    docs = text_splitter.create_documents([file_content]) 



    



    for idx, text in enumerate(docs):



                docs[idx].metadata['name']=file_name



                docs[idx].metadata['type']='txt'







    # print(f"\t Total documents created: {len(docs)}")



    return docs



 







# def parse_text(file_path: str) -> list:



    # Reading the text file



    with open(file_path, 'r', encoding='utf-8') as file_data:



        file_content = file_data.read()







    print(f"\t Reading a file: {file_path}\n\t Length of the File: {len(file_content)}")



    



    # Extract file name from the file path



    file_name = re.search(r'[^/\\]+$', file_path).group(0)



    



    # Initialize the text splitter with the desired chunk size and overlap



    text_splitter = RecursiveCharacterTextSplitter(



        chunk_size=700,  # Adjust this based on your desired chunk size



        chunk_overlap=100, 



        length_function=len



    )



    



    # Split the content into smaller chunks (documents)



    docs = text_splitter.create_documents([file_content])  # Wrap the content in a list



    



    # Add metadata for each document chunk



    for idx, text in enumerate(docs):



        docs[idx].metadata['name'] = file_name



        docs[idx].metadata['type'] = 'txt'



        docs[idx].metadata['page'] = idx + 1  # Assign a unique page number to each chunk



        docs[idx].metadata['total_pages'] = len(docs)



    



    print(f"\t Total documents created: {len(docs)}")



    



    # Return the documents (chunks)



    return docs
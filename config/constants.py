
import os
from dotenv import load_dotenv

load_dotenv()

UPLOAD_DIR = r"C:\Users\VICTUS\Desktop\NURSEBOT\nurse_bot\upload"
PRIMARY_FOLDER = ""  # No subfolder - flat structure
class Config:
    BASE_URL =""
    OPENAI_API_KEY=os.getenv("OPENAI_API_KEY", "")
    PINECONE_API_KEY=os.getenv("PINECONE_API_KEY", "")
    PINECONE_ENV=os.getenv("PINECONE_ENV", "")
    PINECONE_INDEX=os.getenv("PINECONE_INDEX", "")
    PINECONE_TEXT_FIELD=os.getenv("PINECONE_TEXT_FIELD", "text")
    EMBED_MODEL_NAME=os.getenv("EMBED_MODEL_NAME", "text-embedding-ada-002")

SUPER_ADMIN_DATA = {
    "name" : "Super Admin",
    "email" : "Superadmin@gmail.com",
    "password" : "Admin@1234" ,
    "phone_number" : 9021929638,
    "company_name" : "S2P",
    "role": "SUPER_ADMIN"   
}    
 

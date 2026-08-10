import os
import shutil
from typing import Optional
from models.schemas import User
from models.dto import Roles, Status, Product

def save_uploaded_file(file, namespace_id: str) -> bool:
    """
    Save uploaded file to the filesystem
    
    Args:
        file: The uploaded file object
        namespace_id: The namespace ID for organizing files
        
    Returns:
        bool: True if file was saved successfully, False otherwise
    """
    try:
        print(f"DEBUG: Saving file '{file.filename}' for namespace: {namespace_id}")
        
        # Create namespace-specific directory
        from config import constants
        upload_dir = os.path.join(constants.UPLOAD_DIR, namespace_id)
        print(f"DEBUG: Upload directory path: {upload_dir}")
        
        os.makedirs(upload_dir, exist_ok=True)
        print(f"DEBUG: Directory created/verified: {upload_dir}")
        
        # Save file to namespace-specific folder
        file_path = os.path.join(upload_dir, file.filename)
        print(f"DEBUG: Saving to file path: {file_path}")
        
        # Ensure we're at the beginning of the file
        if hasattr(file.file, 'seek'):
            file.file.seek(0)
            print(f"DEBUG: File seek to beginning completed")
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Verify file was saved
        if os.path.exists(file_path):
            file_size = os.path.getsize(file_path)
            print(f"DEBUG: File saved successfully: {file_path} (size: {file_size} bytes)")
            return True
        else:
            print(f"ERROR: File was not saved: {file_path}")
            return False
            
    except Exception as e:
        import traceback
        print(f"ERROR saving file {file.filename}: {str(e)}")
        print(f"ERROR traceback: {traceback.format_exc()}")
        return False

def delete_file(file_path: str) -> bool:
    """
    Delete a file from the filesystem
    
    Args:
        file_path: Path to the file to delete
        
    Returns:
        bool: True if file was deleted successfully, False otherwise
    """
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            return True
        return False
    except Exception as e:
        print(f"Error deleting file {file_path}: {str(e)}")
        return False

def create_super_admin():
    """
    Create a default super admin user if it doesn't exist
    """
    try:
        # Check if super admin already exists
        existing_admin = User.objects(email="admin@nursebot.com").first()
        
        if existing_admin:
            print("Super admin already exists")
            return
        
        # Create super admin user
        super_admin = User(
            name="Super Admin",
            email="admin@nursebot.com",
            password="admin123",  # This will be hashed by the pre_save signal
            phone_number=1234567890,
            company_name="NurseBot",
            status=Status.ACTIVE,
            role=Roles.SUPER_ADMIN,
            product=Product.KNOWLEDGE_MANAGER
        )
        
        super_admin.save()
        print("Super admin created successfully")
        
    except Exception as e:
        print(f"Error creating super admin: {str(e)}")

from fastapi import APIRouter,UploadFile,File,BackgroundTasks,Form,Request,HTTPException

from fastapi.responses import FileResponse

from models.dto import DeleteFileDTO,ChatRequest,CreateBot,DeleteFilesDTO

from typing import List

from services.chat_bot_files_service import ChatbotFilesService

from services.pinecone_service import PineconeService

import os

from config import constants 



router = APIRouter() 



pineconeService = PineconeService()

chatBotFileService = ChatbotFilesService(pineconeService)





@router.post("/fileUpload")

async def upload(chatbot_id:str= Form(...),namespace_id: str= Form(...),files: List[UploadFile] = File(...)):

    print(f"DEBUG UPLOAD: chatbot_id={chatbot_id}, namespace_id={namespace_id}")
    print(f"DEBUG UPLOAD: Number of files: {len(files)}")
    for i, file in enumerate(files):
        print(f"DEBUG UPLOAD: File {i}: {file.filename}, size={file.size}")
    
    result = await chatBotFileService.upload_files(namespace_id,files,chatbot_id)
    print(f"DEBUG UPLOAD: Result: {result}")
    return result



@router.get("")

async def getFilesByChatBotId(chatBotId: str):

    return await chatBotFileService.getFilesByChatBotId(chatBotId)



@router.delete("/file")

async def deleteFile(data:DeleteFileDTO,backgroundTasks: BackgroundTasks):

    return await chatBotFileService.delete_file(data,backgroundTasks)



@router.delete("")

async def deleteFiles(data:DeleteFilesDTO,backgroundTasks: BackgroundTasks):

    return await chatBotFileService.delete_files(data,backgroundTasks)



@router.get("/test-view")

async def test_view():

    return {"message": "Test endpoint working"}



@router.get("/check")

async def check_bot_files(chatBotId: str):

    """Check if bot has uploaded files and vectorization status"""

    try:

        # Get files from database

        from models.schemas import KnowledgeBotFiles

        from bson import ObjectId

        

        # Handle both temporary and permanent IDs
        if chatBotId.startswith("temp_"):
            files = KnowledgeBotFiles.objects(chatbot_id=chatBotId)
        else:
            files = KnowledgeBotFiles.objects(chatbot_id=ObjectId(chatBotId))

        file_count = files.count()

        

        # Get first file's namespace for vectorization check

        namespace_id = None

        if file_count > 0:

            namespace_id = files.first().namespace_id

        

        # Check vectorization status in Pinecone

        vectorized = False

        vector_count = 0

        

        if namespace_id:

            from pinecone import Pinecone

            import os

            

            try:

                pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

                index = pc.Index(os.getenv("PINECONE_INDEX"))

                stats = index.describe_index_stats()

                namespaces = stats.get('namespaces', {})

                

                if namespace_id in namespaces:

                    vector_count = namespaces[namespace_id].get("vector_count", 0)

                    vectorized = vector_count > 0

            except Exception as e:

                print(f"Error checking Pinecone: {e}")

        

        return {

            "has_files": file_count > 0,

            "file_count": file_count,

            "vectorized": vectorized,

            "vector_count": vector_count,

            "namespace_id": namespace_id,

            "message": "Files found" if file_count > 0 else "No files uploaded"

        }

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))



@router.post("/vectorize")

async def vectorize_documents(request: dict, backgroundTasks: BackgroundTasks):

    """Vectorize documents for analysis"""

    try:

        namespace_id = request.get("namespace_id")

        if not namespace_id:

            raise HTTPException(status_code=400, detail="namespace_id is required")

        

        result = await pineconeService.vectorize_documents_main(namespace_id)

        return result

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))



@router.get("/vectorize/status")

async def get_vectorization_status(namespace_id: str):

    """Get vectorization status for a namespace"""

    try:

        # Check if namespace exists in Pinecone

        from pinecone import Pinecone

        import os

        

        pc = Pinecone(api_key=os.getenv("PINECONE_API_KEY"))

        index = pc.Index(os.getenv("PINECONE_INDEX"))

        

        try:

            namespaces = index.describe_index_stats().get('namespaces', {})

            if namespace_id in namespaces:

                return {

                    "status": "completed",

                    "message": "Report analyzed successfully",

                    "count": namespaces[namespace_id].get("vector_count", 0)

                }

            else:

                return {

                    "status": "not_found",

                    "message": "No analysis found"

                }

        except Exception:

            return {

                "status": "not_found", 

                "message": "No analysis found"

            }

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))



@router.post("/diabetes-analysis")
async def analyze_diabetes_report(request: dict):
    """Comprehensive diabetes analysis endpoint"""
    try:
        namespace_id = request.get("namespace_id")
        if not namespace_id:
            raise HTTPException(status_code=400, detail="namespace_id is required")
        
        # Import the diabetes analysis service
        from services.diabetes_analysis_service import DiabetesAnalysisService
        
        # Create service instance and analyze
        analysis_service = DiabetesAnalysisService()
        result = await analysis_service.analyze_uploaded_report(namespace_id)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in diabetes analysis: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.delete("/vectorize")
async def delete_vectorized_docs(namespace_id: str, backgroundTasks: BackgroundTasks):

    """Delete vectorized documents"""

    try:

        result = await pineconeService.delete_vectorized_docs(namespace_id)

        return result

    except Exception as e:

        raise HTTPException(status_code=500, detail=str(e))



@router.get("/view/{file_id}/public")

async def view_file_public(file_id: str, token: str = None):

    """Public file view with token parameter for direct opening"""

    try:

        # Validate token parameter

        if not token:

            raise HTTPException(status_code=401, detail="Token required")

        

        # Verify JWT token

        import jwt

        from datetime import datetime, timedelta

        

        try:

            # Decode the token (same as in JWT middleware)

            payload = jwt.decode(token, os.getenv("JWT_SECRET", "your-secret-key"), algorithms=["HS256"])

            print(f"DEBUG: Token validated for user: {payload.get('email')}")

        except jwt.ExpiredSignatureError:

            raise HTTPException(status_code=401, detail="Token has expired")

        except jwt.InvalidTokenError:

            raise HTTPException(status_code=401, detail="Invalid token")

        

        # Now get the file (same logic as protected endpoint)

        from models.schemas import KnowledgeBotFiles

        from bson import ObjectId

        

        try:

            object_id = ObjectId(file_id)

        except Exception:

            raise HTTPException(status_code=400, detail="Invalid file ID format")

        

        file_record = KnowledgeBotFiles.objects(id=object_id).first()

        

        if not file_record:

            raise HTTPException(status_code=404, detail="File not found")

        

        # Construct file path using namespace subdirectory
        file_path = os.path.join(
            constants.UPLOAD_DIR,
            file_record.namespace_id,
            file_record.name
        )

        

        if not os.path.exists(file_path):

            raise HTTPException(status_code=404, detail="File not found on server")

        

        # Determine media type

        media_type = 'application/octet-stream'

        if file_record.name.lower().endswith('.pdf'):

            media_type = 'application/pdf'

        elif file_record.name.lower().endswith('.jpg') or file_record.name.lower().endswith('.jpeg'):

            media_type = 'image/jpeg'

        elif file_record.name.lower().endswith('.png'):

            media_type = 'image/png'

        

        return FileResponse(

            file_path,

            media_type=media_type,

            filename=file_record.name

        )

    except HTTPException:

        raise

    except Exception as e:

        print(f"Error in public view_file: {str(e)}")

        raise HTTPException(status_code=500, detail=f"Error viewing file: {str(e)}")



@router.get("/view/{file_id}")

async def view_file_protected(file_id: str):

    """View file with token-based authentication (for direct opening)"""

    try:

        print(f"DEBUG: Viewing file with ID: {file_id}")

        

        # Get file info from database with proper ObjectId handling

        from models.schemas import KnowledgeBotFiles

        from bson import ObjectId

        

        try:

            # Convert string ID to ObjectId

            object_id = ObjectId(file_id)

            print(f"DEBUG: Converted to ObjectId: {object_id}")

        except Exception as e:

            print(f"DEBUG: Invalid ObjectId format: {file_id}, error: {e}")

            raise HTTPException(status_code=400, detail="Invalid file ID format")

        

        file_record = KnowledgeBotFiles.objects(id=object_id).first()

        

        if not file_record:

            print(f"DEBUG: File record not found in database for ID: {file_id}")

            # Try to list all files for debugging

            all_files = KnowledgeBotFiles.objects()

            print(f"DEBUG: All files in database:")

            for f in all_files:

                print(f"  - ID: {f.id}, Name: {f.name}, Namespace: {f.namespace_id}")

            raise HTTPException(status_code=404, detail="File not found")

        

        print(f"DEBUG: Found file record: {file_record.name}, namespace: {file_record.namespace_id}")

        

        # Construct file path using namespace subdirectory
        file_path = os.path.join(
            constants.UPLOAD_DIR,
            file_record.namespace_id,
            file_record.name
        )
        
        print(f"DEBUG: Looking for file at path: {file_path}")
        print(f"DEBUG: File exists: {os.path.exists(file_path)}")
        
        if not os.path.exists(file_path):
            print(f"DEBUG: File not found at path: {file_path}")
            
            # List all files in upload directory for debugging
            upload_dir = constants.UPLOAD_DIR
            if os.path.exists(upload_dir):
                files_in_dir = os.listdir(upload_dir)
                print(f"DEBUG: Files in upload directory: {files_in_dir}")
                
                # Try to find by case-insensitive match
                for filename in files_in_dir:
                    if filename.strip().lower() == file_record.name.strip().lower():
                        found_path = os.path.join(upload_dir, filename)
                        print(f"DEBUG: *** FOUND MATCHING FILE: {found_path}")
                        # Return the found file with correct media type
                        media_type = 'application/octet-stream'
                        if filename.lower().endswith('.pdf'):
                            media_type = 'application/pdf'
                        elif filename.lower().endswith('.jpg') or filename.lower().endswith('.jpeg'):
                            media_type = 'image/jpeg'
                        elif filename.lower().endswith('.png'):
                            media_type = 'image/png'
                        
                        return FileResponse(
                            found_path,
                            media_type=media_type,
                            filename=filename
                        )
            
            raise HTTPException(status_code=404, detail="File not found on server")

        # Return file for viewing
        print(f"DEBUG: Returning file: {file_record.name}")

        

        # Determine media type based on file extension

        media_type = 'application/octet-stream'

        if file_record.name.lower().endswith('.pdf'):

            media_type = 'application/pdf'

        elif file_record.name.lower().endswith('.jpg') or file_record.name.lower().endswith('.jpeg'):

            media_type = 'image/jpeg'

        elif file_record.name.lower().endswith('.png'):

            media_type = 'image/png'

        

        return FileResponse(

            file_path,

            media_type=media_type,

            filename=file_record.name

        )

    except HTTPException:

        raise

    except Exception as e:

        print(f"DEBUG: Error in view_file: {str(e)}")

        import traceback

        print(f"DEBUG: Traceback: {traceback.format_exc()}")

        raise HTTPException(status_code=500, detail=f"Error viewing file: {str(e)}")
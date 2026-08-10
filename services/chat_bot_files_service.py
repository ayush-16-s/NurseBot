from bson import ObjectId
from fastapi import  BackgroundTasks
from models.schemas import KnowledgeBotFiles
from utils.helper import save_uploaded_file
from utils.success import error, result, success


class ChatbotFilesService:
    
    def __init__(self,pineconeService):
        self.pineconeService=pineconeService
        
    async def upload_files(self,namespace_id,files,chatbot_id):
        uploaded_files = []
        failed_files = []
        
        if len(files):
            for file in files: 
                try:
                    # Reset file position to start
                    file.file.seek(0)
                    
                    # Save file to filesystem
                    file_saved = save_uploaded_file(file, namespace_id)
                    
                    if file_saved:
                        # Save file metadata to database
                        createdObj = {
                            'name':file.filename,
                            "namespace_id":namespace_id,
                            "chatbot_id":chatbot_id,
                            "size":file.size,
                        }
                        data = KnowledgeBotFiles(**createdObj)
                        data.save()
                        uploaded_files.append(file.filename)
                    else:
                        failed_files.append(file.filename)
                        
                except Exception as e:
                    failed_files.append(file.filename)
                    print(f"Error uploading {file.filename}: {str(e)}")
            
            # Vectorize immediately after successful uploads (not as background task)
            if uploaded_files:
                try:
                    vectorize_result = await self.pineconeService.vectorize_documents_main(namespace_id)
                    print(f"Vectorization result: {vectorize_result}")
                except Exception as e:
                    print(f"Vectorization error: {e}")
                    # Don't fail upload if vectorization fails
                    pass

        # Return appropriate response
        if failed_files and not uploaded_files:
            return error("All files failed to upload")
        elif failed_files and uploaded_files:
            return result({
                "uploaded": uploaded_files,
                "failed": failed_files,
                "message": f"Uploaded {len(uploaded_files)} files, {len(failed_files)} files failed"
            }, "Partial upload completed")
        else:
            return success(f"Total {len(uploaded_files)} files uploaded successfully!")
    
    async def getFilesByChatBotId(self,chatBotId): 
        try:
            # Handle both temporary and permanent IDs
            if chatBotId.startswith("temp_"):
                # Query using the temporary ID string directly
                items = KnowledgeBotFiles.objects(chatbot_id=chatBotId)
            else:
                # Convert to ObjectId for permanent IDs
                items = KnowledgeBotFiles.objects(chatbot_id=ObjectId(chatBotId))
            
            files_list = [item.to_mongo().to_dict() for item in items]
            print(f"DEBUG: Found {len(files_list)} files for chatbot {chatBotId}")
            return result(files_list)
        except Exception as e:
            print(f"Error getting files for chatbot {chatBotId}: {e}")
            return result([]) 
        
    
    async def delete_files(self,data,backgroundTasks:BackgroundTasks): 
            reqObj={
             "ids":data.ids,
             "names":data.names,
             "namespace_id":data.namespace_id
            } 
            
            object_ids = [ObjectId(id) for id in reqObj['ids']] 
            result = KnowledgeBotFiles.objects(id__in=object_ids).delete()
            
            # Delete physical files from namespace subdirectory
            import os
            from config import constants
            for name in reqObj['names']:
                file_path = os.path.join(constants.UPLOAD_DIR, reqObj['namespace_id'], name)
                if os.path.exists(file_path):
                    os.remove(file_path)
                    print(f"DEBUG: Deleted file from disk: {file_path}")
            
            backgroundTasks.add_task(self.pineconeService.delete_vectorized_docs,reqObj['namespace_id'],"name",reqObj['names'])
            return success("File deleted Successfully!")
    
    async def delete_file(self,data,backgroundTasks:BackgroundTasks): 
        
            reqObj={
             "id":data.id,
             "name":data.name,
             "namespace_id":data.namespace_id
            }  
            
            result = KnowledgeBotFiles.objects(id=ObjectId(reqObj['id'])).delete()
            
            # Delete physical file from namespace subdirectory
            import os
            from config import constants
            file_path = os.path.join(constants.UPLOAD_DIR, reqObj['namespace_id'], reqObj['name'])
            if os.path.exists(file_path):
                os.remove(file_path)
                print(f"DEBUG: Deleted file from disk: {file_path}")
            
            backgroundTasks.add_task(self.pineconeService.delete_vectorized_docs,reqObj['namespace_id'],"name",[reqObj['name']])
            if result == 0:
                return error(f"Item with ID {reqObj['id']} deleted successfully")
            else:
                return success("File deleted Successfully!")
        
    
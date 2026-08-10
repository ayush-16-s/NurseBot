from datetime import datetime
import uuid
from fastapi import BackgroundTasks
from utils.success import error, result,success
from models.schemas import KnowledgeBot, User
from dotenv import load_dotenv
from bson import ObjectId
from fastapi.responses import StreamingResponse
import json
load_dotenv()

 

class ChatBot:
    
    def __init__(self,pineconeService):
        self.pineconeService = pineconeService

    async def create(self,data,request,backgroundTasks:BackgroundTasks):
        id = request.state.user['id']
        user = User.objects(id = ObjectId(id)).first()
        if not user:
             return error('User Not Found')
        namespace_id = str(uuid.uuid4())  
        data_dict = data.dict()  
        data_dict['namespace_id'] = namespace_id
        data_dict['user_id'] = id 

        botData = KnowledgeBot(**data_dict)      
        botData.save()
        
        return result({
            "namespace_id": namespace_id,
            "botId": str(botData.id)
        }, "Congratulations, your created your bot")
    
    async def getBotByUserId(self,request):  
         id = request.query_params.get('id') if request.query_params.get('id') else request.state.user['id']
         items = KnowledgeBot.objects(user_id =ObjectId(id))

         result_list = [item.to_mongo().to_dict() for item in items]
         if result_list:
             print(f"DEBUG - First bot _id: {result_list[0]['_id']}")
             print(f"DEBUG - First bot _id type: {type(result_list[0]['_id'])}")
         return result(result_list)
        
    
    async def getBotById(self,id): 
         cursor = KnowledgeBot.objects(id = ObjectId(id))  
         return result(cursor.first().to_mongo().to_dict())
      
    
    async def chat_conversation(self,data):  
            question = data.question
            namespace_id = data.namespace_id 
            chatHistory = ""
            
            # Handle chatHistory - it could be a list or string
            if hasattr(data, 'chatHistory') and data.chatHistory:
                if isinstance(data.chatHistory, list):
                    for chat in data.chatHistory:
                        if hasattr(chat, 'question') and hasattr(chat, 'Ai_response'):
                            chatHistory += f"User: {chat.question}\nAI: {chat.Ai_response}\n"
                elif isinstance(data.chatHistory, str):
                    chatHistory = data.chatHistory
                else:
                    print(f"Unexpected chatHistory type: {type(data.chatHistory)}")
            
            print(f"DEBUG: Processing chat request - Question: {question[:50]}..., Namespace: {namespace_id}")
            print(f"DEBUG: ChatHistory length: {len(chatHistory)}")
            
            # Create async generator for streaming response
            async def generate_response():
                try:
                    response_generator = self.pineconeService.chain_resp(namespace_id, question, chatHistory)
                    # If it's a coroutine, await it first
                    if hasattr(response_generator, '__await__'):
                        # It's a coroutine, get the result
                        result = await response_generator
                        if isinstance(result, str):
                            yield f"data: {json.dumps({'content': result})}\n\n"
                        else:
                            # If it's supposed to be a generator, iterate through it
                            async for chunk in result:
                                yield f"data: {json.dumps({'content': chunk})}\n\n"
                    else:
                        # It should be an async generator
                        async for chunk in response_generator:
                            yield f"data: {json.dumps({'content': chunk})}\n\n"
                except Exception as e:
                    import traceback
                    print(f"ERROR in generate_response: {e}")
                    print(f"ERROR traceback: {traceback.format_exc()}")
                    yield f"data: {json.dumps({'content': 'Sorry, I encountered an error processing your request.'})}\n\n"
            
            return StreamingResponse(generate_response(), media_type="text/event-stream")
    
    async def delete(self, id, request):
        try:
            # Debug logging
            print(f"Delete request received with ID: {id}")
            print(f"ID type: {type(id)}")
            
            # Validate ID
            if not id or id == "undefined" or id == "null":
                return error("Invalid patient ID")
            
            # Try to create ObjectId, catch invalid format
            try:
                object_id = ObjectId(id)
            except Exception as e:
                print(f"Invalid ObjectId format: {e}")
                return error("Invalid patient ID format")
            
            # Get the bot to find its namespace_id
            bot = KnowledgeBot.objects(id=object_id).first()
            if not bot:
                return error("Bot not found")
            
            namespace_id = bot.namespace_id
            print(f"DEBUG: Deleting bot with namespace_id: {namespace_id}")
            
            # Try to delete associated files from Pinecone (may not exist)
            try:
                await self.pineconeService.delete_vectorized_docs(namespace_id)
                print(f"DEBUG: Pinecone vectors deleted for namespace: {namespace_id}")
            except Exception as pinecone_error:
                # Log but don't fail if Pinecone namespace doesn't exist
                print(f"DEBUG: Pinecone delete failed (namespace may not exist): {pinecone_error}")
                # Continue with deletion anyway
            
            # Delete local uploaded files if they exist
            try:
                from config import constants
                import shutil
                upload_dir = os.path.join(constants.UPLOAD_DIR, namespace_id)
                if os.path.exists(upload_dir):
                    shutil.rmtree(upload_dir)
                    print(f"DEBUG: Local files deleted: {upload_dir}")
            except Exception as file_error:
                print(f"DEBUG: Error deleting local files: {file_error}")
                # Continue with deletion anyway
            
            # Delete associated file records from MongoDB
            try:
                from models.schemas import KnowledgeBotFiles
                deleted_files = KnowledgeBotFiles.objects(namespace_id=namespace_id).delete()
                print(f"DEBUG: Deleted {deleted_files} file records from MongoDB")
            except Exception as db_error:
                print(f"DEBUG: Error deleting file records: {db_error}")
                # Continue with deletion anyway
            
            # Delete the bot from MongoDB
            bot.delete()
            print(f"DEBUG: Bot deleted successfully: {id}")
            
            return success("Patient deleted successfully")
        except Exception as e:
            print(f"ERROR in delete: {e}")
            import traceback
            print(f"ERROR traceback: {traceback.format_exc()}")
            return error(f"Failed to delete patient: {str(e)}")

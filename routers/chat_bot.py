from fastapi import APIRouter, UploadFile, File, BackgroundTasks, Form, Request
from models.dto import DeleteFileDTO,ChatRequest,CreateBot,DeleteFilesDTO
from services.chat_bot_service import ChatBot
from typing import List
from services.pinecone_service import PineconeService
import json
router = APIRouter() 

# Lazy initialization to prevent import-time database connections
pineconeService = None
chatBotService = None

def get_pinecone_service():
    global pineconeService, chatBotService
    if pineconeService is None:
        pineconeService = PineconeService()
        chatBotService = ChatBot(pineconeService)
    return pineconeService, chatBotService


@router.post("")
async def create(data:CreateBot,request: Request,backgroundTasks: BackgroundTasks = None):
    _, chatBotService = get_pinecone_service()
    return await chatBotService.create(data,request,backgroundTasks)

@router.get("/all")
async def getBotByUserId(request: Request):
    _, chatBotService = get_pinecone_service()
    return await chatBotService.getBotByUserId(request)


@router.post("/chat")
async def chatConversation(data: ChatRequest):
    _, chatBotService = get_pinecone_service()
    return await chatBotService.chat_conversation(data)

@router.get("/{id}")
async def getBotById(id: str):
    _, chatBotService = get_pinecone_service()
    return await chatBotService.getBotById(id)

@router.delete("/{id}")
async def deleteBot(id: str, request: Request):
    _, chatBotService = get_pinecone_service()
    return await chatBotService.delete(id, request)

# @router.post("/fileUpload")
# async def upload(namespace_id: str= Form(...),files: List[UploadFile] = File(...),backgroundTasks: BackgroundTasks = None):
#     _, chatBotService = get_pinecone_service()
#     return await chatBotService.upload_files(namespace_id,files,backgroundTasks)

# @router.get("/files")
# async def getFiles(namespace_id: str):
#     return await chatBotService.get_files(namespace_id)

# @router.delete("/files")
# async def deleteFiles(data:DeleteFilesDTO,backgroundTasks: BackgroundTasks):
#     return await chatBotService.delete_files(data,backgroundTasks)

# @router.delete("/file")
# async def deleteFile(data:DeleteFileDTO,backgroundTasks: BackgroundTasks):
#     return await chatBotService.delete_file(data,backgroundTasks)



 

 
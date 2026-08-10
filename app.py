from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from routers import chat_bot, chat_bot_files, user
from config.mongodb import init_db

# Try to import with fallback
try:
    from utils.background_exception import CustomExceptionHandler
except ImportError:
    print("Warning: CustomExceptionHandler not found, using basic exception handling")
    CustomExceptionHandler = None

from utils.helper import create_super_admin
from utils.jwt import JwtMiddleware

app = FastAPI(
    swagger_ui_parameters={"displayRequestDuration": True},
    openapi_url="/openapi.json"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add exception handler middleware if available
if CustomExceptionHandler:
    app.add_middleware(CustomExceptionHandler)
else:
    print("Warning: CustomExceptionHandler not available, some features may be limited")

# Add JWT middleware with exempt routes
exempt_routes = [
    "/user/login", "/user/register", "/user/verify-email", 
    "/user/reset-password", "/docs", "/chat-bot/chat", 
    "/openapi.json", "/files/view/*/public", "/health", "/files",
    "/files/diabetes-analysis"
]

app.add_middleware(JwtMiddleware, exempt_routes=exempt_routes)

# Initialize database and create super admin
init_db()
create_super_admin()

# Health check endpoint
@app.get("/health")
async def healthCheck():
    return "Ok"

# Include routers
app.include_router(chat_bot.router, prefix="/chat-bot", tags=["ChatBot"])
app.include_router(user.router, prefix="/user", tags=["User"])
app.include_router(chat_bot_files.router, prefix="/files", tags=["Files"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=9000)

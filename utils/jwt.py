from typing import Optional
import jwt
import os 
import json
import bcrypt
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from bson import ObjectId,json_util
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from utils.success import un_authorized



class JwtHandler():
      
      @staticmethod
      def encode(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()

        # Set expiration time
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
            to_encode.update({"exp": expire})
        else:
            # Fetch the expiration time from the environment and convert it to an integer
            expiration_minutes = os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")  # Default to 30 minutes
            try:
                expiration_minutes = int(expiration_minutes)  # Convert string to integer
            except ValueError:
                raise ValueError(f"Invalid value for ACCESS_TOKEN_EXPIRE_MINUTES: {expiration_minutes}")
            expire = datetime.utcnow() + timedelta(minutes=expiration_minutes)
            to_encode.update({"exp": expire})

        # Encode the JWT token
        encoded_jwt = jwt.encode(to_encode, os.getenv('JWT_SECRET'), algorithm=os.getenv('JWT_ALGO'))
        return encoded_jwt
            # return  jwt.encode(json.loads(json_util.dumps({'_id':id})),os.getenv('JWT_SECRET'),os.getenv('JWT_ALGO'))
      
      @staticmethod
      def decode(token): 
            try:
                # Decode the token and check if it's valid
                payload = jwt.decode(token, os.getenv('JWT_SECRET'), algorithms=[os.getenv('JWT_ALGO')])
                # You can also manually check if the expiration time is in the future
            #     if datetime.utcfromtimestamp(payload["exp"]) < datetime.utcnow():
            #         return JSONResponse(
            #     status_code=status.HTTP_401_UNAUTHORIZED,
            #     content={"message":"Token is Expired"},
            # )
                return payload
            except jwt.ExpiredSignatureError:
                # Token is expired
                return {"message":"Token is Expired"}
            #     return JSONResponse(
            #     status_code=status.HTTP_401_UNAUTHORIZED,
            #     content={"message":"Token is Expired"},
            # )
            except jwt.PyJWTError:
                # Token is invalid in any other way
                return {"message":"Invalid Token"}

            #     return JSONResponse(
            #     status_code=status.HTTP_401_UNAUTHORIZED,
            #     content={"message":"Invalid Token"},
            # )
        #   return jwt.decode(token, key=os.getenv('JWT_SECRET'), algorithms=os.getenv('JWT_ALGO'))

         

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

         


class JwtMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, exempt_routes=None):
        super().__init__(app)
        self.exempt_routes = exempt_routes or []

    def is_exempt(self, path):
        """Check if path matches any exempt route pattern"""
        print(f"JWT Middleware - Checking if path {path} is exempt")
        for route in self.exempt_routes:
            if '*' in route:
                # Handle wildcard patterns
                pattern = route.replace('*', '.*')
                import re
                if re.match(f"^{pattern}$", path):
                    print(f"JWT Middleware - Path {path} matches wildcard route {route}")
                    return True
            elif route == path:
                # Exact match
                print(f"JWT Middleware - Path {path} exactly matches route {route}")
                return True
        print(f"JWT Middleware - Path {path} is not exempt")
        return False

    async def dispatch(self, request, call_next):
      
        print(f"JWT Middleware - Path: {request.url.path}")
        print(f"JWT Middleware - Method: {request.method}")
        print(f"JWT Middleware - Headers: {dict(request.headers)}")

        # Handle OPTIONS requests for CORS pre-flight
        if request.method == "OPTIONS":
            response = await call_next(request)
            # Add CORS headers to OPTIONS response
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response
            
        if self.is_exempt(request.url.path):
            return await call_next(request)
        auth_header = request.headers.get("authorization") 
        print(f"JWT Middleware - Auth header: {auth_header}")
        
        if not auth_header:
            print("JWT Middleware - No auth header found")
            response = JSONResponse(
                content={"message":"Authorization token is missing"},
                status_code=status.HTTP_401_UNAUTHORIZED,
            )
            # Add CORS headers to error response
            response.headers["Access-Control-Allow-Origin"] = "*"
            response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
            response.headers["Access-Control-Allow-Headers"] = "*"
            response.headers["Access-Control-Allow-Credentials"] = "true"
            return response
        
     
        
        token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header
        print(f"JWT Middleware - Extracted token: {token[:20]}...")
        decoded_token = JwtHandler.decode(token)
        print(f"JWT Middleware - Decoded token: {decoded_token}")
        
        if "message" in decoded_token:
            print('JWT Middleware - Token decode failed:', decoded_token["message"])
            return un_authorized(f"{decoded_token['message']}")
        
        request.state.user = decoded_token  # Attach decoded token to request
        print("JWT Middleware - Token validated successfully")
        return await call_next(request)
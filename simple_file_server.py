"""
Simple file server that serves uploaded files directly
This bypasses the complex backend and serves files from the upload directory
"""
import os
import sys
from pathlib import Path
from urllib.parse import unquote
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
import json

class FileServerHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.upload_dir = os.path.join(os.getcwd(), 'upload')
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        # Parse the path
        if self.path.startswith('/files/'):
            # Handle file requests
            path_parts = self.path[7:].split('/')  # Remove '/files/' prefix
            
            if len(path_parts) >= 3 and path_parts[1] == 'uploaded-file':
                namespace_id = path_parts[0]
                filename = unquote('/'.join(path_parts[2:]))
                
                # Construct full file path
                file_path = os.path.join(self.upload_dir, namespace_id, 'uploaded-file', filename)
                
                print(f"Looking for file: {file_path}")
                
                if os.path.exists(file_path) and os.path.isfile(file_path):
                    # Serve the file
                    self.serve_file(file_path, filename)
                else:
                    self.send_error(404, f"File not found: {filename}")
            else:
                self.send_error(400, "Invalid file path format")
        else:
            # Serve API endpoints
            if self.path == '/api/files':
                self.serve_file_list()
            else:
                self.send_error(404, "Not found")
    
    def serve_file(self, file_path, filename):
        """Serve a file with proper content type"""
        try:
            with open(file_path, 'rb') as f:
                content = f.read()
            
            # Determine content type
            content_type = self.guess_type(file_path)
            
            self.send_response(200)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(content)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', '*')
            self.end_headers()
            self.wfile.write(content)
            
            print(f"Served file: {filename} ({len(content)} bytes, {content_type})")
        except Exception as e:
            print(f"Error serving file: {e}")
            self.send_error(500, f"Error serving file: {e}")
    
    def serve_file_list(self):
        """Serve a list of all available files"""
        try:
            files = []
            
            if os.path.exists(self.upload_dir):
                for namespace_dir in os.listdir(self.upload_dir):
                    namespace_path = os.path.join(self.upload_dir, namespace_dir)
                    if os.path.isdir(namespace_path):
                        uploaded_file_dir = os.path.join(namespace_path, 'uploaded-file')
                        if os.path.exists(uploaded_file_dir):
                            for filename in os.listdir(uploaded_file_dir):
                                file_path = os.path.join(uploaded_file_dir, filename)
                                if os.path.isfile(file_path):
                                    files.append({
                                        'name': filename,
                                        'namespace_id': namespace_dir,
                                        'size': os.path.getsize(file_path),
                                        'url': f'/files/{namespace_dir}/uploaded-file/{filename}'
                                    })
            
            response_data = json.dumps(files, indent=2)
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Content-Length', str(len(response_data)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(response_data.encode())
            
        except Exception as e:
            print(f"Error listing files: {e}")
            self.send_error(500, f"Error listing files: {e}")
    
    def guess_type(self, file_path):
        """Guess file type based on extension"""
        ext = os.path.splitext(file_path)[1].lower()
        types = {
            '.pdf': 'application/pdf',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.txt': 'text/plain',
            '.html': 'text/html',
        }
        return types.get(ext, 'application/octet-stream')
    
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.end_headers()

def start_simple_file_server():
    """Start the simple file server"""
    upload_dir = os.path.join(os.getcwd(), 'upload')
    
    if not os.path.exists(upload_dir):
        print(f"Upload directory not found: {upload_dir}")
        print("Make sure you're running this from the nurse_bot directory")
        return
    
    port = 8080
    handler = FileServerHandler
    
    with TCPServer(("", port), handler) as httpd:
        print(f"📄 Simple File Server started at http://localhost:{port}")
        print(f"📁 Serving files from: {upload_dir}")
        print("")
        print("🔗 Available endpoints:")
        print(f"   • List files: http://localhost:{port}/api/files")
        print(f"   • View file: http://localhost:{port}/files/{{namespace_id}}/uploaded-file/{{filename}}")
        print("")
        print("📝 Example file URLs:")
        
        # Show example URLs for existing files
        if os.path.exists(upload_dir):
            for namespace_dir in os.listdir(upload_dir):
                namespace_path = os.path.join(upload_dir, namespace_dir)
                if os.path.isdir(namespace_path):
                    uploaded_file_dir = os.path.join(namespace_path, 'uploaded-file')
                    if os.path.exists(uploaded_file_dir):
                        for filename in os.listdir(uploaded_file_dir)[:2]:  # Show first 2 files
                            file_url = f"http://localhost:{port}/files/{namespace_dir}/uploaded-file/{filename}"
                            print(f"   • {file_url}")
        
        print("")
        print("⏹️  Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")

if __name__ == "__main__":
    start_simple_file_server()

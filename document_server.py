"""
Simple static file server for document viewing
Run this separately from the main backend
"""
import os
import sys
from pathlib import Path
from http.server import SimpleHTTPRequestHandler
from socketserver import TCPServer
import urllib.parse

class DocumentHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, upload_dir=None, **kwargs):
        self.upload_dir = upload_dir
        super().__init__(*args, **kwargs)
    
    def do_GET(self):
        # Parse the path
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path.lstrip('/')
        
        if path.startswith('docs/'):
            # This is a document request
            file_path = path[5:]  # Remove 'docs/' prefix
            
            # Construct full file path
            full_path = os.path.join(self.upload_dir, file_path)
            
            if os.path.exists(full_path) and os.path.isfile(full_path):
                # Serve the file
                self.serve_file(full_path)
            else:
                self.send_error(404, "File not found")
        else:
            # Serve static files or index
            super().do_GET()
    
    def serve_file(self, file_path):
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
            self.end_headers()
            self.wfile.write(content)
        except Exception as e:
            self.send_error(500, f"Error serving file: {e}")
    
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

def start_document_server():
    """Start the document server"""
    upload_dir = os.path.join(os.getcwd(), 'upload')
    
    if not os.path.exists(upload_dir):
        print(f"Upload directory not found: {upload_dir}")
        return
    
    port = 8080
    handler = lambda *args, **kwargs: DocumentHandler(*args, upload_dir=upload_dir, **kwargs)
    
    with TCPServer(("", port), handler) as httpd:
        print(f"📄 Document server started at http://localhost:{port}")
        print(f"📁 Serving files from: {upload_dir}")
        print("🔗 Access files at: http://localhost:8080/docs/{namespace_id}/uploaded-file/{filename}")
        print("⏹️  Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")

if __name__ == "__main__":
    start_document_server()

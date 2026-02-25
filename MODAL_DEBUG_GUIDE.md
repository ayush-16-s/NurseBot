# 🔍 Debug Guide for Modal Viewer Issue

## Problem: Modal shows blank page after clicking expand button

### **Step 1: Check Browser Console**
1. Open browser developer tools (F12)
2. Go to Console tab
3. Click the expand button (📐) on a file
4. Look for debug messages starting with "=== MODAL VIEW DEBUG ==="

### **Expected Console Output:**
```
=== MODAL VIEW DEBUG ===
File ID: 699c74e4e120d21fa040e3a3
File Name: Sonkusare R (1).pdf
Token exists: true
Opening modal viewer...
Fetching from URL: http://localhost:5173/api/files/view/699c74e4e120d21fa040e3a3
Starting fetch request...
Fetch response status: 200
Fetch response headers: {content-type: "application/pdf", ...}
Response OK, getting blob...
Blob created, size: 400723, type: application/pdf
Converting blob to base64...
Base64 conversion successful, length: 1234567
Setting file content...
PDF iframe loaded successfully
```

### **Common Issues & Solutions:**

#### **Issue 1: Backend Server Not Running**
**Console Error:** `Failed to load resource: net::ERR_CONNECTION_REFUSED`
**Solution:** Start the backend server
```bash
cd nurse_bot
python app.py
```

#### **Issue 2: Authentication Failed**
**Console Error:** `Fetch response status: 401`
**Solution:** Check if you're logged in and token exists
```javascript
// In browser console:
localStorage.getItem('km_user_token')
```

#### **Issue 3: File Not Found**
**Console Error:** `Fetch response status: 404`
**Solution:** Check if file exists in database and on disk
```bash
cd nurse_bot
python debug_files.py
```

#### **Issue 4: CORS Issues**
**Console Error:** `Access-Control-Allow-Origin`
**Solution:** Backend CORS configuration issue

#### **Issue 5: Base64 Conversion Failed**
**Console Error:** `Base64 conversion failed`
**Solution:** File might be corrupted or format issue

---

## **Quick Test - Use Download Button**

If modal viewer doesn't work, try the download button (📥):
1. Click download icon
2. File should download to your computer
3. Open with any PDF viewer
4. If download works, the file exists and authentication works

---

## **Debug Modal Content**

The modal now shows debug information:
- **File Content Length:** Should be > 0 if loaded
- **File Name:** Should show the correct file name
- **Is PDF:** Should show "Yes" for PDF files

If you see "No file content loaded" in the modal, check the console for errors.

---

## **Alternative Solutions**

### **Option 1: Static File Server**
If backend has issues, use the static file server:
```bash
cd nurse_bot
python document_server.py
```
Access files at: `http://localhost:8080/docs/namespace_id/uploaded-file/filename`

### **Option 2: Fix Backend Dependencies**
Install missing packages:
```bash
cd nurse_bot
pip install langchain langchain-text-splitter langchain-community pinecone-client
```

### **Option 3: Use Download Only**
Use the download button as primary method until backend is fixed.

---

## **Next Steps**

1. **Check console logs** when clicking expand button
2. **Verify backend is running** and accessible
3. **Test download button** to confirm file exists
4. **Check authentication** token in localStorage
5. **Look for specific error messages** in console

The debug information will help identify exactly where the issue is occurring! 🔍

# Frontend Debug Guide for File Upload Issues

## Quick Fixes to Try:

### 1. Clear Browser Storage
1. Open browser developer tools (F12)
2. Go to Application/Storage tab
3. Clear Local Storage
4. Login again with:
   - Email: ayushsonkusare1601@gmail.com
   - Password: Admin@1234

### 2. Check Browser Console
1. Open developer tools (F12)
2. Go to Console tab
3. Click expand button (🔍) or download button (📥)
4. Look for red error messages
5. Screenshot any errors and share them

### 3. Test API Directly
Open these URLs in browser with authentication:
- Files API: http://127.0.0.1:8000/files?chatBotId=699d6a1f2f31fe7054faa342
- View File: http://127.0.0.1:8000/files/view/699e006bb8b7deda5147f36c

### 4. Common Issues and Fixes

#### Issue: "Authentication required"
- Fix: Clear localStorage and login again

#### Issue: "CORS error"
- Fix: Backend CORS is already configured, should work

#### Issue: "File not found"
- Fix: Check if file ID is correct (should be 699e006bb8b7deda5147f36c)

#### Issue: "Network error"
- Fix: Check if backend is running on port 8000

### 5. Manual Download Test
If buttons don't work, try downloading directly:
1. Get file ID: 699e006bb8b7deda5147f36c
2. Get token from localStorage: km_user_token
3. Use curl or Postman to test download

### 6. Frontend Code Issues to Check

In FileUpload.jsx, verify:
- Line 458: `file._id["$oid"]` should extract correct ID
- Line 471: `apiBaseUrl` should be correct
- Line 566: Download URL should be correct

### 7. Expected Working Flow
1. Login ✅
2. Go to bot list ✅
3. Click "Upload Report" for STK bot ✅
4. See file in table ✅
5. Click expand button (🔍) → Should open PDF in modal ✅
6. Click download button (📥) → Should download PDF ✅

# Frontend 401 Unauthorized Fix Guide

## Problem Analysis
- Backend API works (returns 200 in Python requests)
- Frontend gets 401 Unauthorized in browser
- This is typically a CORS + Credentials issue

## Immediate Fixes to Try

### 1. Clear Browser Data
1. Open Developer Tools (F12)
2. Right-click refresh → "Empty Cache and Hard Reload"
3. Or clear all browser data for localhost

### 2. Check Token in localStorage
1. Open Developer Tools (F12)
2. Go to Application → Local Storage
3. Look for `km_user_token`
4. If missing, login again

### 3. Test API in Browser Console
Open browser console and run:
```javascript
fetch('http://127.0.0.1:8000/files/view/699e006bb8b7deda5147f36c', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5M2Q2YzgxOGYyYzg5MDQ4ZDM0NmE2ZSIsImV4cCI6MTc3MjAwNTIyMX0.9fgVU9lcIJ0nNVeAkE8d9j5lKJWICg4ec4SJENWiz5o',
        'Content-Type': 'application/json'
    }
})
.then(response => console.log('Status:', response.status))
.catch(error => console.error('Error:', error));
```

### 4. Backend CORS Fix (if needed)
If the above fails, the backend might need CORS credentials fix:

Add to app.py:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### 5. Frontend Request Fix
Update the fetch calls to include credentials:
```javascript
const response = await fetch(url, {
    method: 'GET',
    credentials: 'include',  // Add this
    headers: {
        'Authorization': `Bearer ${token}`,
    },
});
```

## Debug Steps
1. Try the console test above
2. Check backend logs for JWT debugging output
3. If still failing, restart frontend dev server
4. Ensure both frontend and backend are running

## Expected Result
- File view should work without 401 errors
- Download should work properly
- Console should show successful responses

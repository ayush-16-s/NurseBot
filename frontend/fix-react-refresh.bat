@echo off
echo Fixing React Refresh issues...

echo Clearing Vite cache...
if exist node_modules\.vite rmdir /s /q node_modules\.vite
if exist .vite rmdir /s /q .vite

echo Clearing browser cache files...
if exist dist rmdir /s /q dist

echo Reinstalling dependencies...
call npm install

echo Starting development server...
call npm run dev

pause

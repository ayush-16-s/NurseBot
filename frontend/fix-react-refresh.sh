#!/bin/bash
# Fix React Refresh issues

echo "🔧 Fixing React Refresh issues..."

# Clear Vite cache
echo "🗑️  Clearing Vite cache..."
rm -rf node_modules/.vite
rm -rf .vite

# Clear browser cache related files
echo "🗑️  Clearing browser cache files..."
rm -rf dist

# Reinstall dependencies to ensure everything is fresh
echo "📦 Reinstalling dependencies..."
npm install

# Start the dev server
echo "🚀 Starting development server..."
npm run dev

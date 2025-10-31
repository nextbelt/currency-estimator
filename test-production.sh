#!/bin/bash
# Test Production Build Script

echo "🏗️  Building production version..."
npm run build

echo "🚀 Starting production server..."
cd backend
NODE_ENV=production node server.js
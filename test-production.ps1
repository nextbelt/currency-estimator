# Test Production Build Script for PowerShell

Write-Host "🏗️  Building production version..." -ForegroundColor Green
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
    Write-Host "🚀 Starting production server..." -ForegroundColor Blue
    
    cd backend
    $env:NODE_ENV = "production"
    node server.js
} else {
    Write-Host "❌ Build failed!" -ForegroundColor Red
}
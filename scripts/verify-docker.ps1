#!/usr/bin/env pwsh
# Local Docker verification script for PitalRecord

$ErrorActionPreference = "Stop"

Write-Host "🐳 PitalRecord Docker Verification" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
Set-Location $ProjectRoot

$imageTag = "pitalrecord:local"
$containerName = "pitalrecord-local-test"

Write-Host "📁 Project root: $ProjectRoot" -ForegroundColor Gray

# Ensure Docker is available
Write-Host ""
Write-Host "🔍 Checking Docker availability..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "   ✅ $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not available. Start Docker Desktop and try again." -ForegroundColor Red
    exit 1
}

# Cleanup old test container if it exists
Write-Host ""
Write-Host "🧹 Cleaning previous Docker test artifacts..." -ForegroundColor Yellow
docker rm -f $containerName 2>$null | Out-Null

# Build image
Write-Host ""
Write-Host "🏗️  Building Docker image..." -ForegroundColor Yellow
$buildStart = Get-Date

docker build `
    --build-arg NEXT_PUBLIC_SUPABASE_URL="https://example.supabase.co" `
    --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY="dummy-local-key" `
    -t $imageTag `
    -f Dockerfile .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed" -ForegroundColor Red
    exit 1
}

$buildTime = ((Get-Date) - $buildStart).TotalSeconds
Write-Host "   ✅ Docker build succeeded in $([math]::Round($buildTime, 2))s" -ForegroundColor Green

# Run container
Write-Host ""
Write-Host "🚀 Starting test container..." -ForegroundColor Yellow
docker run -d --name $containerName -p 3000:3000 $imageTag | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start Docker container" -ForegroundColor Red
    exit 1
}

# Wait for startup and verify endpoint
Write-Host ""
Write-Host "🔍 Waiting for application health..." -ForegroundColor Yellow
$healthy = $false
for ($i = 1; $i -le 20; $i++) {
    Start-Sleep -Seconds 3
    try {
        $resp = Invoke-WebRequest -Uri "http://localhost:3000" -TimeoutSec 5
        if ($resp.StatusCode -eq 200) {
            Write-Host "   ✅ Application responded with HTTP 200" -ForegroundColor Green
            $healthy = $true
            break
        }
    } catch {
        Write-Host "   Waiting... attempt $i/20" -ForegroundColor Gray
    }
}

if (-not $healthy) {
    Write-Host "❌ Container health check failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Container logs:" -ForegroundColor Yellow
    docker logs --tail 120 $containerName
    docker rm -f $containerName | Out-Null
    exit 1
}

# Cleanup
Write-Host ""
Write-Host "🧹 Cleaning test container..." -ForegroundColor Yellow
docker rm -f $containerName | Out-Null

Write-Host ""
Write-Host "✅ Docker verification completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Push code to master/main to trigger deployment workflow" -ForegroundColor Gray
Write-Host "  2. Monitor GitHub Actions workflow logs" -ForegroundColor Gray
Write-Host "  3. Verify EC2 endpoint after deployment" -ForegroundColor Gray

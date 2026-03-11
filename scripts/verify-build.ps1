#!/usr/bin/env pwsh
# Local Build Verification Script for PitalRecord
# This script verifies that the application builds correctly locally

$ErrorActionPreference = "Stop"

Write-Host "🔍 PitalRecord Local Build Verification" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get script directory and project root
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir

# Change to project root
Set-Location $ProjectRoot
Write-Host "📁 Project root: $ProjectRoot" -ForegroundColor Gray

# Check Node.js version
Write-Host ""
Write-Host "📦 Checking Node.js version..." -ForegroundColor Yellow
$nodeVersion = node --version
Write-Host "   Node.js: $nodeVersion" -ForegroundColor Green

if (-not ($nodeVersion -match "v20" -or $nodeVersion -match "v2[1-9]")) {
    Write-Host "❌ Node.js 20+ required. Current: $nodeVersion" -ForegroundColor Red
    exit 1
}

# Check pnpm
Write-Host ""
Write-Host "📦 Checking pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version
    Write-Host "   pnpm: $pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ pnpm not found. Installing..." -ForegroundColor Red
    corepack enable
    corepack prepare pnpm@9.0.6 --activate
    $pnpmVersion = pnpm --version
    Write-Host "   ✅ pnpm installed: $pnpmVersion" -ForegroundColor Green
}

# Clean previous builds
Write-Host ""
Write-Host "🧹 Cleaning previous builds..." -ForegroundColor Yellow
if (Test-Path "apps/web/.next") {
    Remove-Item -Recurse -Force "apps/web/.next"
    Write-Host "   ✅ Cleaned .next directory" -ForegroundColor Green
}
if (Test-Path "node_modules") {
    Write-Host "   Preserving node_modules (use 'pnpm clean' to remove)" -ForegroundColor Gray
}

# Install dependencies
Write-Host ""
Write-Host "📥 Installing dependencies..." -ForegroundColor Yellow
$installOutput = pnpm install --frozen-lockfile 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Dependency installation failed!" -ForegroundColor Red
    Write-Host $installOutput -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Dependencies installed" -ForegroundColor Green

# Type check
Write-Host ""
Write-Host "🔍 Running type check..." -ForegroundColor Yellow
$typecheckOutput = pnpm typecheck 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Type check failed!" -ForegroundColor Red
    Write-Host $typecheckOutput -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Type check passed" -ForegroundColor Green

# Lint
Write-Host ""
Write-Host "🔍 Running linter..." -ForegroundColor Yellow
$lintOutput = pnpm lint 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Linting issues found (continuing...)" -ForegroundColor Yellow
    Write-Host $lintOutput -ForegroundColor Yellow
} else {
    Write-Host "   ✅ Linting passed" -ForegroundColor Green
}

# Build
Write-Host ""
Write-Host "🏗️  Building application..." -ForegroundColor Yellow
$buildStart = Get-Date
$buildOutput = pnpm build 2>&1
$buildEnd = Get-Date
$buildTime = ($buildEnd - $buildStart).TotalSeconds

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    Write-Host $buildOutput -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ Build completed in $([math]::Round($buildTime, 2))s" -ForegroundColor Green

# Verify build output
Write-Host ""
Write-Host "🔍 Verifying build output..." -ForegroundColor Yellow
$requiredFiles = @(
    "apps/web/.next/standalone/apps/web/server.js",
    "apps/web/.next/static"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file exists" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Missing: $file" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host ""
    Write-Host "❌ Build verification failed - missing required files" -ForegroundColor Red
    exit 1
}

# Get build statistics
Write-Host ""
Write-Host "📊 Build Statistics:" -ForegroundColor Cyan
if (Test-Path "apps/web/.next/standalone") {
    $standaloneSize = (Get-ChildItem -Path "apps/web/.next/standalone" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Standalone size: $([math]::Round($standaloneSize, 2)) MB" -ForegroundColor Gray
}
if (Test-Path "apps/web/.next/static") {
    $staticSize = (Get-ChildItem -Path "apps/web/.next/static" -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
    Write-Host "   Static assets: $([math]::Round($staticSize, 2)) MB" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✅ Build verification completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Test Docker build: .\scripts\verify-docker.ps1" -ForegroundColor Gray
Write-Host "  2. Test locally: pnpm dev" -ForegroundColor Gray
Write-Host "  3. Deploy: git push (triggers GitHub Actions)" -ForegroundColor Gray
Write-Host ""

exit 0

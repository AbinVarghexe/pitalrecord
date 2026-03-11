# ============================================================
# PitalRecord - Interactive Credentials Setup Script
# ============================================================
# This script collects all required credentials and configures:
# - GitHub repository secrets
# - Local .env files
# - AWS configuration validation
# ============================================================

$ErrorActionPreference = "Stop"

Write-Host @"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    PitalRecord - Automated Credentials Setup              ║
║                                                            ║
║    This wizard will collect all required credentials      ║
║    and configure your deployment automatically.           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝

"@ -ForegroundColor Cyan

# Create object to store all credentials
$credentials = @{}

# ============================================================
# Helper Functions
# ============================================================

function Read-SecureValue {
    param(
        [string]$Prompt,
        [string]$Description,
        [bool]$IsSecret = $false,
        [string]$DefaultValue = ""
    )
    
    Write-Host "`n$Prompt" -ForegroundColor Yellow
    if ($Description) {
        Write-Host "  💡 $Description" -ForegroundColor Gray
    }
    if ($DefaultValue) {
        Write-Host "  (Default: $DefaultValue)" -ForegroundColor DarkGray
    }
    
    if ($IsSecret) {
        Write-Host "  🔒 " -NoNewline -ForegroundColor Red
        $secureValue = Read-Host -AsSecureString
        $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secureValue)
        $value = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    } else {
        Write-Host "  ➤  " -NoNewline -ForegroundColor Green
        $value = Read-Host
    }
    
    if ([string]::IsNullOrWhiteSpace($value) -and $DefaultValue) {
        return $DefaultValue
    }
    
    return $value
}

function Test-GitHubCLI {
    try {
        $null = gh --version
        return $true
    } catch {
        return $false
    }
}

function Show-Progress {
    param([string]$Message)
    Write-Host "`n✓ $Message" -ForegroundColor Green
}

function Show-Error {
    param([string]$Message)
    Write-Host "`n✗ $Message" -ForegroundColor Red
}

function Show-Section {
    param([string]$Title)
    Write-Host "`n" ("=" * 60) -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host ("=" * 60) -ForegroundColor Cyan
}

# ============================================================
# Section 1: AWS Credentials
# ============================================================

Show-Section "1️⃣  AWS Credentials"

Write-Host @"

These credentials are used by GitHub Actions to:
- Push Docker images to ECR
- Deploy to EC2 instance
- Manage AWS resources

You can get these from AWS IAM Console:
https://console.aws.amazon.com/iam/

"@ -ForegroundColor Gray

$credentials.AWS_ACCESS_KEY_ID = Read-SecureValue `
    -Prompt "Enter AWS Access Key ID:" `
    -Description "From IAM User with EC2 and ECR permissions" `
    -IsSecret $false

$credentials.AWS_SECRET_ACCESS_KEY = Read-SecureValue `
    -Prompt "Enter AWS Secret Access Key:" `
    -Description "Keep this secure - treat like a password" `
    -IsSecret $true

$credentials.AWS_REGION = Read-SecureValue `
    -Prompt "Enter AWS Region:" `
    -Description "Example: us-east-1, us-west-2, eu-west-1" `
    -DefaultValue "us-east-1"

# ============================================================
# Section 2: AWS ECR Configuration
# ============================================================

Show-Section "2️⃣  AWS ECR (Elastic Container Registry)"

Write-Host @"

ECR stores your Docker images. You need to create a repository first:
aws ecr create-repository --repository-name pitalrecord-web

"@ -ForegroundColor Gray

$credentials.ECR_REPOSITORY_NAME = Read-SecureValue `
    -Prompt "Enter ECR Repository Name:" `
    -Description "Name of your ECR repository" `
    -DefaultValue "pitalrecord-web"

# ============================================================
# Section 3: EC2 Configuration
# ============================================================

Show-Section "3️⃣  AWS EC2 Instance Configuration"

Write-Host @"

Your EC2 instance details where the application will be deployed.

"@ -ForegroundColor Gray

$credentials.EC2_HOST = Read-SecureValue `
    -Prompt "Enter EC2 Public IP or Hostname:" `
    -Description "Example: 54.123.45.67 or ec2-54-123-45-67.compute-1.amazonaws.com"

$credentials.EC2_USER = Read-SecureValue `
    -Prompt "Enter EC2 SSH User:" `
    -Description "Usually 'ec2-user' for Amazon Linux or 'ubuntu' for Ubuntu" `
    -DefaultValue "ec2-user"

Write-Host "`nEnter EC2 SSH Private Key (.pem file):" -ForegroundColor Yellow
Write-Host "  💡 Path to your .pem file (e.g., C:\keys\pitalrecord-key.pem)" -ForegroundColor Gray
Write-Host "  ➤  " -NoNewline -ForegroundColor Green
$sshKeyPath = Read-Host

if (Test-Path $sshKeyPath) {
    $credentials.EC2_SSH_PRIVATE_KEY = Get-Content $sshKeyPath -Raw
    Show-Progress "SSH private key loaded successfully"
} else {
    Show-Error "SSH key file not found. You'll need to add this manually."
    $credentials.EC2_SSH_PRIVATE_KEY = "[PASTE_YOUR_PEM_FILE_CONTENT_HERE]"
}

# ============================================================
# Section 4: Supabase Configuration
# ============================================================

Show-Section "4️⃣  Supabase Configuration"

Write-Host @"

Supabase credentials for authentication and database.

Get these from: https://app.supabase.com
→ Select your project
→ Settings → API

"@ -ForegroundColor Gray

$credentials.NEXT_PUBLIC_SUPABASE_URL = Read-SecureValue `
    -Prompt "Enter Supabase Project URL:" `
    -Description "Example: https://xxxxxxxxxxxxx.supabase.co"

$credentials.NEXT_PUBLIC_SUPABASE_ANON_KEY = Read-SecureValue `
    -Prompt "Enter Supabase Anon Public Key:" `
    -Description "Starts with 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'" `
    -IsSecret $true

# ============================================================
# Section 5: Summary and Confirmation
# ============================================================

Show-Section "📋  Configuration Summary"

Write-Host @"

Collected Credentials:
----------------------
AWS Access Key ID:     $($credentials.AWS_ACCESS_KEY_ID)
AWS Region:            $($credentials.AWS_REGION)
ECR Repository:        $($credentials.ECR_REPOSITORY_NAME)
EC2 Host:              $($credentials.EC2_HOST)
EC2 User:              $($credentials.EC2_USER)
Supabase URL:          $($credentials.NEXT_PUBLIC_SUPABASE_URL)

Sensitive values (hidden for security):
- AWS Secret Access Key: ****
- EC2 SSH Private Key: ****
- Supabase Anon Key: ****

"@ -ForegroundColor White

Write-Host "Does this look correct? (Y/N): " -NoNewline -ForegroundColor Yellow
$confirm = Read-Host

if ($confirm -ne "Y" -and $confirm -ne "y") {
    Show-Error "Setup cancelled. Run the script again to retry."
    exit 1
}

# ============================================================
# Section 6: Create Local .env File
# ============================================================

Show-Section "💾  Creating Local Environment Files"

$envContent = @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=$($credentials.NEXT_PUBLIC_SUPABASE_URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY=$($credentials.NEXT_PUBLIC_SUPABASE_ANON_KEY)

# AWS Configuration (For local development/testing)
AWS_REGION=$($credentials.AWS_REGION)
AWS_ACCESS_KEY_ID=$($credentials.AWS_ACCESS_KEY_ID)
AWS_SECRET_ACCESS_KEY=$($credentials.AWS_SECRET_ACCESS_KEY)

# Note: For production, these are set via GitHub Secrets
# and injected during Docker build
"@

$envPath = Join-Path $PSScriptRoot ".." ".env"
$envContent | Out-File -FilePath $envPath -Encoding UTF8
Show-Progress "Created .env file at: $envPath"

# Also create for web app
$webEnvPath = Join-Path $PSScriptRoot ".." "apps" "web" ".env.local"
$webEnvContent = @"
NEXT_PUBLIC_SUPABASE_URL=$($credentials.NEXT_PUBLIC_SUPABASE_URL)
NEXT_PUBLIC_SUPABASE_ANON_KEY=$($credentials.NEXT_PUBLIC_SUPABASE_ANON_KEY)
"@
$webEnvContent | Out-File -FilePath $webEnvPath -Encoding UTF8
Show-Progress "Created .env.local file at: $webEnvPath"

# ============================================================
# Section 7: GitHub Secrets Configuration
# ============================================================

Show-Section "🔒  GitHub Secrets Configuration"

$hasGHCLI = Test-GitHubCLI

if ($hasGHCLI) {
    Write-Host @"

✓ GitHub CLI detected!

Would you like to automatically add secrets to your repository? (Y/N): 
"@ -ForegroundColor Green -NoNewline
    
    $autoAdd = Read-Host
    
    if ($autoAdd -eq "Y" -or $autoAdd -eq "y") {
        Show-Progress "Adding secrets to GitHub repository..."
        
        try {
            gh secret set AWS_ACCESS_KEY_ID -b "$($credentials.AWS_ACCESS_KEY_ID)"
            gh secret set AWS_SECRET_ACCESS_KEY -b "$($credentials.AWS_SECRET_ACCESS_KEY)"
            gh secret set AWS_REGION -b "$($credentials.AWS_REGION)"
            gh secret set ECR_REPOSITORY_NAME -b "$($credentials.ECR_REPOSITORY_NAME)"
            gh secret set EC2_HOST -b "$($credentials.EC2_HOST)"
            gh secret set EC2_USER -b "$($credentials.EC2_USER)"
            gh secret set EC2_SSH_PRIVATE_KEY -b "$($credentials.EC2_SSH_PRIVATE_KEY)"
            gh secret set NEXT_PUBLIC_SUPABASE_URL -b "$($credentials.NEXT_PUBLIC_SUPABASE_URL)"
            gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY -b "$($credentials.NEXT_PUBLIC_SUPABASE_ANON_KEY)"
            
            Show-Progress "All GitHub secrets added successfully! 🎉"
        } catch {
            Show-Error "Failed to add secrets: $_"
            Show-Error "You'll need to add them manually."
            $hasGHCLI = $false
        }
    } else {
        $hasGHCLI = $false
    }
}

if (-not $hasGHCLI) {
    Write-Host @"

GitHub CLI not detected or automatic setup skipped.

Add these secrets manually:
1. Go to: https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions
2. Click "New repository secret" for each:

"@ -ForegroundColor Yellow

    # Save secrets to file for manual copying
    $secretsContent = @"
# GitHub Repository Secrets
# Add these at: https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions

AWS_ACCESS_KEY_ID
$($credentials.AWS_ACCESS_KEY_ID)

AWS_SECRET_ACCESS_KEY
$($credentials.AWS_SECRET_ACCESS_KEY)

AWS_REGION
$($credentials.AWS_REGION)

ECR_REPOSITORY_NAME
$($credentials.ECR_REPOSITORY_NAME)

EC2_HOST
$($credentials.EC2_HOST)

EC2_USER
$($credentials.EC2_USER)

EC2_SSH_PRIVATE_KEY
$($credentials.EC2_SSH_PRIVATE_KEY)

NEXT_PUBLIC_SUPABASE_URL
$($credentials.NEXT_PUBLIC_SUPABASE_URL)

NEXT_PUBLIC_SUPABASE_ANON_KEY
$($credentials.NEXT_PUBLIC_SUPABASE_ANON_KEY)
"@

    $secretsPath = Join-Path $PSScriptRoot "github-secrets.txt"
    $secretsContent | Out-File -FilePath $secretsPath -Encoding UTF8
    
    Show-Progress "Secrets saved to: $secretsPath"
    Write-Host "  You can copy and paste from this file." -ForegroundColor Gray
}

# ============================================================
# Section 8: Next Steps
# ============================================================

Show-Section "✨  Setup Complete!"

Write-Host @"

Your credentials have been configured successfully! 

📁 Files Created:
   ✓ .env (root directory)
   ✓ apps/web/.env.local (web app)
$(if (-not $hasGHCLI) { "   ✓ scripts/github-secrets.txt (for manual GitHub setup)" } else { "" })

🚀 Next Steps:

   1. Verify GitHub Secrets
      → https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions

   2. Create AWS Resources (if not done yet):
      • ECR Repository: aws ecr create-repository --repository-name pitalrecord-web
      • EC2 Instance: aws ec2 run-instances ...
      • Security Groups: Configure ports 22, 80, 443

   3. Setup EC2 Instance:
      • SSH into your EC2: ssh -i <key>.pem $($credentials.EC2_USER)@$($credentials.EC2_HOST)
      • Run: ./scripts/setup-ec2.sh

   4. Deploy:
      • Push to master branch: git push origin master
      • Monitor: https://github.com/AbinVarghexe/pitalrecord/actions

   5. Access your app:
      • http://$($credentials.EC2_HOST)

📚 Documentation:
   • Full guide: docs/AWS_DEPLOYMENT_GUIDE.md
   • Checklist: docs/DEPLOYMENT_CHECKLIST.md
   • MCP Setup: docs/AWS_MCP_INTEGRATION.md

"@ -ForegroundColor Green

Write-Host @"
═══════════════════════════════════════════════════════════
🎉 Happy Deploying! Your application is ready for AWS!
═══════════════════════════════════════════════════════════

"@ -ForegroundColor Cyan

# Optional: Install GitHub CLI helper
if (-not (Test-GitHubCLI)) {
    Write-Host @"
💡 TIP: Install GitHub CLI for easier secret management:
   Windows: winget install --id GitHub.cli
   Or visit: https://cli.github.com/

"@ -ForegroundColor Yellow
}

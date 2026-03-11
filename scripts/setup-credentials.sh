#!/bin/bash

# ============================================================
# PitalRecord - Interactive Credentials Setup Script (Bash)
# ============================================================
# This script collects all required credentials and configures:
# - GitHub repository secrets
# - Local .env files
# - AWS configuration validation
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
cat << "EOF"
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║    PitalRecord - Automated Credentials Setup              ║
║                                                            ║
║    This wizard will collect all required credentials      ║
║    and configure your deployment automatically.           ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Create associative array for credentials
declare -A credentials

# ============================================================
# Helper Functions
# ============================================================

read_value() {
    local prompt="$1"
    local description="$2"
    local default="$3"
    local is_secret="$4"
    
    echo -e "\n${YELLOW}$prompt${NC}"
    if [ -n "$description" ]; then
        echo -e "  ${GRAY}💡 $description${NC}"
    fi
    if [ -n "$default" ]; then
        echo -e "  ${GRAY}(Default: $default)${NC}"
    fi
    
    if [ "$is_secret" = "true" ]; then
        echo -e -n "  ${RED}🔒 ${NC}"
        read -s value
        echo
    else
        echo -e -n "  ${GREEN}➤  ${NC}"
        read value
    fi
    
    if [ -z "$value" ] && [ -n "$default" ]; then
        value="$default"
    fi
    
    echo "$value"
}

show_progress() {
    echo -e "\n${GREEN}✓ $1${NC}"
}

show_error() {
    echo -e "\n${RED}✗ $1${NC}"
}

show_section() {
    echo -e "\n${CYAN}$(printf '=%.0s' {1..60})${NC}"
    echo -e "${CYAN}  $1${NC}"
    echo -e "${CYAN}$(printf '=%.0s' {1..60})${NC}"
}

test_github_cli() {
    if command -v gh &> /dev/null; then
        return 0
    else
        return 1
    fi
}

# ============================================================
# Section 1: AWS Credentials
# ============================================================

show_section "1️⃣  AWS Credentials"

cat << EOF

${GRAY}These credentials are used by GitHub Actions to:
- Push Docker images to ECR
- Deploy to EC2 instance
- Manage AWS resources

You can get these from AWS IAM Console:
https://console.aws.amazon.com/iam/${NC}

EOF

credentials[AWS_ACCESS_KEY_ID]=$(read_value \
    "Enter AWS Access Key ID:" \
    "From IAM User with EC2 and ECR permissions" \
    "" \
    "false")

credentials[AWS_SECRET_ACCESS_KEY]=$(read_value \
    "Enter AWS Secret Access Key:" \
    "Keep this secure - treat like a password" \
    "" \
    "true")

credentials[AWS_REGION]=$(read_value \
    "Enter AWS Region:" \
    "Example: us-east-1, us-west-2, eu-west-1" \
    "us-east-1" \
    "false")

# ============================================================
# Section 2: AWS ECR Configuration
# ============================================================

show_section "2️⃣  AWS ECR (Elastic Container Registry)"

cat << EOF

${GRAY}ECR stores your Docker images. You need to create a repository first:
aws ecr create-repository --repository-name pitalrecord-web${NC}

EOF

credentials[ECR_REPOSITORY_NAME]=$(read_value \
    "Enter ECR Repository Name:" \
    "Name of your ECR repository" \
    "pitalrecord-web" \
    "false")

# ============================================================
# Section 3: EC2 Configuration
# ============================================================

show_section "3️⃣  AWS EC2 Instance Configuration"

cat << EOF

${GRAY}Your EC2 instance details where the application will be deployed.${NC}

EOF

credentials[EC2_HOST]=$(read_value \
    "Enter EC2 Public IP or Hostname:" \
    "Example: 54.123.45.67 or ec2-54-123-45-67.compute-1.amazonaws.com" \
    "" \
    "false")

credentials[EC2_USER]=$(read_value \
    "Enter EC2 SSH User:" \
    "Usually 'ec2-user' for Amazon Linux or 'ubuntu' for Ubuntu" \
    "ec2-user" \
    "false")

echo -e "\n${YELLOW}Enter EC2 SSH Private Key (.pem file):${NC}"
echo -e "  ${GRAY}💡 Path to your .pem file (e.g., /path/to/pitalrecord-key.pem)${NC}"
echo -e -n "  ${GREEN}➤  ${NC}"
read ssh_key_path

if [ -f "$ssh_key_path" ]; then
    credentials[EC2_SSH_PRIVATE_KEY]=$(cat "$ssh_key_path")
    show_progress "SSH private key loaded successfully"
else
    show_error "SSH key file not found. You'll need to add this manually."
    credentials[EC2_SSH_PRIVATE_KEY]="[PASTE_YOUR_PEM_FILE_CONTENT_HERE]"
fi

# ============================================================
# Section 4: Supabase Configuration
# ============================================================

show_section "4️⃣  Supabase Configuration"

cat << EOF

${GRAY}Supabase credentials for authentication and database.

Get these from: https://app.supabase.com
→ Select your project
→ Settings → API${NC}

EOF

credentials[NEXT_PUBLIC_SUPABASE_URL]=$(read_value \
    "Enter Supabase Project URL:" \
    "Example: https://xxxxxxxxxxxxx.supabase.co" \
    "" \
    "false")

credentials[NEXT_PUBLIC_SUPABASE_ANON_KEY]=$(read_value \
    "Enter Supabase Anon Public Key:" \
    "Starts with 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'" \
    "" \
    "true")

# ============================================================
# Section 5: Summary and Confirmation
# ============================================================

show_section "📋  Configuration Summary"

cat << EOF

Collected Credentials:
----------------------
AWS Access Key ID:     ${credentials[AWS_ACCESS_KEY_ID]}
AWS Region:            ${credentials[AWS_REGION]}
ECR Repository:        ${credentials[ECR_REPOSITORY_NAME]}
EC2 Host:              ${credentials[EC2_HOST]}
EC2 User:              ${credentials[EC2_USER]}
Supabase URL:          ${credentials[NEXT_PUBLIC_SUPABASE_URL]}

Sensitive values (hidden for security):
- AWS Secret Access Key: ****
- EC2 SSH Private Key: ****
- Supabase Anon Key: ****

EOF

echo -e -n "${YELLOW}Does this look correct? (Y/N): ${NC}"
read confirm

if [ "$confirm" != "Y" ] && [ "$confirm" != "y" ]; then
    show_error "Setup cancelled. Run the script again to retry."
    exit 1
fi

# ============================================================
# Section 6: Create Local .env File
# ============================================================

show_section "💾  Creating Local Environment Files"

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Create root .env file
cat > "$PROJECT_ROOT/.env" << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${credentials[NEXT_PUBLIC_SUPABASE_URL]}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${credentials[NEXT_PUBLIC_SUPABASE_ANON_KEY]}

# AWS Configuration (For local development/testing)
AWS_REGION=${credentials[AWS_REGION]}
AWS_ACCESS_KEY_ID=${credentials[AWS_ACCESS_KEY_ID]}
AWS_SECRET_ACCESS_KEY=${credentials[AWS_SECRET_ACCESS_KEY]}

# Note: For production, these are set via GitHub Secrets
# and injected during Docker build
EOF

show_progress "Created .env file at: $PROJECT_ROOT/.env"

# Create web app .env.local file
mkdir -p "$PROJECT_ROOT/apps/web"
cat > "$PROJECT_ROOT/apps/web/.env.local" << EOF
NEXT_PUBLIC_SUPABASE_URL=${credentials[NEXT_PUBLIC_SUPABASE_URL]}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${credentials[NEXT_PUBLIC_SUPABASE_ANON_KEY]}
EOF

show_progress "Created .env.local file at: $PROJECT_ROOT/apps/web/.env.local"

# ============================================================
# Section 7: GitHub Secrets Configuration
# ============================================================

show_section "🔒  GitHub Secrets Configuration"

if test_github_cli; then
    echo -e "\n${GREEN}✓ GitHub CLI detected!${NC}"
    echo -e "\n${GREEN}Would you like to automatically add secrets to your repository? (Y/N): ${NC}"
    read auto_add
    
    if [ "$auto_add" = "Y" ] || [ "$auto_add" = "y" ]; then
        show_progress "Adding secrets to GitHub repository..."
        
        cd "$PROJECT_ROOT"
        
        gh secret set AWS_ACCESS_KEY_ID -b "${credentials[AWS_ACCESS_KEY_ID]}" && \
        gh secret set AWS_SECRET_ACCESS_KEY -b "${credentials[AWS_SECRET_ACCESS_KEY]}" && \
        gh secret set AWS_REGION -b "${credentials[AWS_REGION]}" && \
        gh secret set ECR_REPOSITORY_NAME -b "${credentials[ECR_REPOSITORY_NAME]}" && \
        gh secret set EC2_HOST -b "${credentials[EC2_HOST]}" && \
        gh secret set EC2_USER -b "${credentials[EC2_USER]}" && \
        gh secret set EC2_SSH_PRIVATE_KEY -b "${credentials[EC2_SSH_PRIVATE_KEY]}" && \
        gh secret set NEXT_PUBLIC_SUPABASE_URL -b "${credentials[NEXT_PUBLIC_SUPABASE_URL]}" && \
        gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY -b "${credentials[NEXT_PUBLIC_SUPABASE_ANON_KEY]}"
        
        if [ $? -eq 0 ]; then
            show_progress "All GitHub secrets added successfully! 🎉"
            SECRETS_ADDED=true
        else
            show_error "Failed to add secrets. You'll need to add them manually."
            SECRETS_ADDED=false
        fi
    else
        SECRETS_ADDED=false
    fi
else
    SECRETS_ADDED=false
fi

if [ "$SECRETS_ADDED" != "true" ]; then
    cat << EOF

${YELLOW}GitHub CLI not detected or automatic setup skipped.

Add these secrets manually:
1. Go to: https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions
2. Click "New repository secret" for each:${NC}

EOF

    # Save secrets to file for manual copying
    cat > "$SCRIPT_DIR/github-secrets.txt" << EOF
# GitHub Repository Secrets
# Add these at: https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions

AWS_ACCESS_KEY_ID
${credentials[AWS_ACCESS_KEY_ID]}

AWS_SECRET_ACCESS_KEY
${credentials[AWS_SECRET_ACCESS_KEY]}

AWS_REGION
${credentials[AWS_REGION]}

ECR_REPOSITORY_NAME
${credentials[ECR_REPOSITORY_NAME]}

EC2_HOST
${credentials[EC2_HOST]}

EC2_USER
${credentials[EC2_USER]}

EC2_SSH_PRIVATE_KEY
${credentials[EC2_SSH_PRIVATE_KEY]}

NEXT_PUBLIC_SUPABASE_URL
${credentials[NEXT_PUBLIC_SUPABASE_URL]}

NEXT_PUBLIC_SUPABASE_ANON_KEY
${credentials[NEXT_PUBLIC_SUPABASE_ANON_KEY]}
EOF

    show_progress "Secrets saved to: $SCRIPT_DIR/github-secrets.txt"
    echo -e "  ${GRAY}You can copy and paste from this file.${NC}"
fi

# ============================================================
# Section 8: Next Steps
# ============================================================

show_section "✨  Setup Complete!"

cat << EOF

${GREEN}Your credentials have been configured successfully! 

📁 Files Created:
   ✓ .env (root directory)
   ✓ apps/web/.env.local (web app)
EOF

if [ "$SECRETS_ADDED" != "true" ]; then
    echo "   ✓ scripts/github-secrets.txt (for manual GitHub setup)"
fi

cat << EOF

🚀 Next Steps:

   1. Verify GitHub Secrets
      → https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions

   2. Create AWS Resources (if not done yet):
      • ECR Repository: aws ecr create-repository --repository-name pitalrecord-web
      • EC2 Instance: aws ec2 run-instances ...
      • Security Groups: Configure ports 22, 80, 443

   3. Setup EC2 Instance:
      • SSH into your EC2: ssh -i <key>.pem ${credentials[EC2_USER]}@${credentials[EC2_HOST]}
      • Run: ./scripts/setup-ec2.sh

   4. Deploy:
      • Push to master branch: git push origin master
      • Monitor: https://github.com/AbinVarghexe/pitalrecord/actions

   5. Access your app:
      • http://${credentials[EC2_HOST]}

📚 Documentation:
   • Full guide: docs/AWS_DEPLOYMENT_GUIDE.md
   • Checklist: docs/DEPLOYMENT_CHECKLIST.md
   • MCP Setup: docs/AWS_MCP_INTEGRATION.md

${NC}
EOF

echo -e "${CYAN}"
cat << "EOF"
═══════════════════════════════════════════════════════════
🎉 Happy Deploying! Your application is ready for AWS!
═══════════════════════════════════════════════════════════
EOF
echo -e "${NC}"

# Optional: Install GitHub CLI helper
if ! test_github_cli; then
    cat << EOF
${YELLOW}💡 TIP: Install GitHub CLI for easier secret management:
   Linux: https://github.com/cli/cli/blob/trunk/docs/install_linux.md
   macOS: brew install gh
   Or visit: https://cli.github.com/${NC}

EOF
fi

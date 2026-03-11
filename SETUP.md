# 🚀 Quick Setup Guide

Choose your preferred method to set up all required credentials automatically.

## Method 1: Automated Interactive Setup (Recommended)

We provide interactive scripts that will ask you for all required credentials and configure everything automatically.

### Windows (PowerShell)

```powershell
# Run the interactive setup script
.\scripts\setup-credentials.ps1
```

### Linux/macOS (Bash)

```bash
# Make the script executable
chmod +x ./scripts/setup-credentials.sh

# Run the interactive setup script
./scripts/setup-credentials.sh
```

## What the Script Will Ask For

The script will prompt you for the following 9 credentials:

### 1. AWS Credentials (3 items)
- **AWS_ACCESS_KEY_ID**: Your IAM user access key
- **AWS_SECRET_ACCESS_KEY**: Your IAM user secret key (hidden input)
- **AWS_REGION**: AWS region (default: us-east-1)

### 2. ECR Configuration (1 item)
- **ECR_REPOSITORY_NAME**: Name of your ECR repository (default: pitalrecord-web)

### 3. EC2 Configuration (3 items)
- **EC2_HOST**: Public IP or hostname of your EC2 instance
- **EC2_USER**: SSH username (default: ec2-user)
- **EC2_SSH_PRIVATE_KEY**: Path to your .pem file (will be read automatically)

### 4. Supabase Configuration (2 items)
- **NEXT_PUBLIC_SUPABASE_URL**: Your Supabase project URL
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: Your Supabase anon/public key (hidden input)

📖 **[Complete Credentials Guide with Diagrams →](./docs/CREDENTIALS_GUIDE.md)**

## What the Script Does Automatically

1. ✅ **Creates `.env` file** in the root directory
2. ✅ **Creates `.env.local` file** for the Next.js app
3. ✅ **Adds GitHub Secrets** (if GitHub CLI is installed)
4. ✅ **Validates input** and shows you a summary
5. ✅ **Generates backup file** with all secrets for manual setup

## Prerequisites

Before running the setup script, ensure you have:

- [ ] **AWS Account** with IAM user created
- [ ] **EC2 Instance** launched and accessible
- [ ] **ECR Repository** created in AWS
- [ ] **Supabase Project** created
- [ ] **SSH Key (.pem file)** for EC2 access
- [ ] **(Optional) GitHub CLI** for automatic secret addition

## Optional: Install GitHub CLI

For automatic GitHub secrets setup:

### Windows
```powershell
winget install --id GitHub.cli
```

### macOS
```bash
brew install gh
```

### Linux
```bash
# Debian/Ubuntu
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh
```

Then authenticate:
```bash
gh auth login
```

## Method 2: Manual Setup

If you prefer to set up credentials manually, follow the checklist:

📋 **[See Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md)**

## After Setup

Once the script completes:

1. **Verify GitHub Secrets**
   - Go to: https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions
   - Ensure all 9 secrets are present

2. **Setup EC2 Instance**
   ```bash
   # SSH into your EC2
   ssh -i your-key.pem ec2-user@YOUR_EC2_IP
   
   # Run the EC2 setup script
   cd /home/ec2-user
   curl -o setup-ec2.sh https://raw.githubusercontent.com/AbinVarghexe/pitalrecord/master/scripts/setup-ec2.sh
   chmod +x setup-ec2.sh
   ./setup-ec2.sh
   ```

3. **Deploy Your Application**
   ```bash
   # From your local machine
   git add .
   git commit -m "Initial setup"
   git push origin master
   ```

4. **Monitor Deployment**
   - GitHub Actions: https://github.com/AbinVarghexe/pitalrecord/actions
   - Watch the workflow execute
   - Check for any errors

5. **Access Your Application**
   - Open browser: `http://YOUR_EC2_IP`
   - Your app should be live!

## Troubleshooting

### Script Won't Run (PowerShell)

If you get an execution policy error:
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup-credentials.ps1
```

### Script Won't Run (Bash)

Make sure it's executable:
```bash
chmod +x ./scripts/setup-credentials.sh
./scripts/setup-credentials.sh
```

### GitHub CLI Not Found

The script works without GitHub CLI, but you'll need to add secrets manually:
1. Run the script anyway - it will save secrets to `github-secrets.txt`
2. Copy values from that file to GitHub manually

### SSH Key Not Found

Ensure:
- The path to your .pem file is correct
- The file has correct permissions (Linux/macOS: `chmod 400 key.pem`)
- You're using the full absolute path

### Wrong AWS Region

If you're not using `us-east-1`, make sure to:
1. Specify the correct region when prompted
2. Update your ECR repository in the same region
3. Launch EC2 instance in the same region

## Security Notes

⚠️ **Important:**
- Never commit `.env` files to git
- Keep your `.pem` file secure (never share or commit)
- Rotate AWS credentials regularly
- The `github-secrets.txt` file contains sensitive data - delete it after use
- Use AWS IAM policies with least privilege

## Next Steps

After successful setup:
- 📖 Read the [AWS Deployment Guide](./docs/AWS_DEPLOYMENT_GUIDE.md)
- 🤖 Set up [AWS MCP Integration](./docs/AWS_MCP_INTEGRATION.md) for AI-assisted AWS management
- 📋 Follow the [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md)

## Getting Help

If you encounter issues:
1. Check the [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md)
2. Review the [AWS Deployment Guide](./docs/AWS_DEPLOYMENT_GUIDE.md)
3. Open an issue on GitHub with:
   - Which script you ran (PowerShell or Bash)
   - Error message (redact sensitive data)
   - What step failed

---

**Ready to deploy? Run the setup script and you'll be live in minutes! 🚀**

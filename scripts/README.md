# Scripts Directory

This directory contains automation scripts for setting up and managing your PitalRecord deployment.

## 🚀 Automated Credential Setup

### setup-credentials.ps1 (Windows PowerShell)
**Purpose:** Interactive wizard to collect and configure all deployment credentials.

**Usage:**
```powershell
.\scripts\setup-credentials.ps1
```

**Features:**
- ✅ Prompts for all 9 required credentials with helpful descriptions
- ✅ Validates input and shows confirmation summary
- ✅ Creates `.env` files automatically
- ✅ Adds GitHub secrets (if GitHub CLI is installed)
- ✅ Generates backup file for manual setup
- ✅ Security: Hides sensitive inputs (passwords, keys)

**Requirements:**
- Windows PowerShell 5.1 or higher
- (Optional) GitHub CLI for automatic secret addition

---

### setup-credentials.sh (Linux/macOS Bash)
**Purpose:** Interactive wizard to collect and configure all deployment credentials.

**Usage:**
```bash
chmod +x ./scripts/setup-credentials.sh
./scripts/setup-credentials.sh
```

**Features:**
- ✅ Prompts for all 9 required credentials with helpful descriptions
- ✅ Validates input and shows confirmation summary
- ✅ Creates `.env` files automatically
- ✅ Adds GitHub secrets (if GitHub CLI is installed)
- ✅ Generates backup file for manual setup
- ✅ Security: Hides sensitive inputs (passwords, keys)

**Requirements:**
- Bash shell (Linux/macOS/WSL)
- (Optional) GitHub CLI for automatic secret addition

---

## 🔧 EC2 Instance Setup

### setup-ec2.sh (Run on EC2 Instance)
**Purpose:** Prepares your EC2 instance for running the Dockerized application.

**Usage:**
```bash
# On your EC2 instance
curl -o setup-ec2.sh https://raw.githubusercontent.com/AbinVarghexe/pitalrecord/master/scripts/setup-ec2.sh
chmod +x setup-ec2.sh
./setup-ec2.sh
```

**What it does:**
1. Updates system packages
2. Installs Docker and Docker Compose
3. Installs AWS CLI
4. Creates application directory structure
5. Sets up Docker daemon
6. Configures swap memory (if needed)
7. Sets up log rotation
8. Configures AWS ECR authentication

**Requirements:**
- Amazon Linux 2/2023 or Ubuntu
- sudo privileges
- Internet connectivity

---

## 📋 Credentials Required

All scripts work with these 9 credentials:

| Credential | Description |
|------------|-------------|
| `AWS_ACCESS_KEY_ID` | IAM user access key |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret key |
| `AWS_REGION` | AWS region (e.g., us-east-1) |
| `ECR_REPOSITORY_NAME` | ECR repository name |
| `EC2_HOST` | EC2 public IP or hostname |
| `EC2_USER` | SSH username (ec2-user/ubuntu) |
| `EC2_SSH_PRIVATE_KEY` | Complete .pem file content |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |

📖 **[Complete Credentials Guide →](../docs/CREDENTIALS_GUIDE.md)**

---

## 🔄 Workflow

### First-Time Setup

1. **Collect Credentials**
   ```powershell
   # Windows
   .\scripts\setup-credentials.ps1
   
   # Linux/macOS
   ./scripts/setup-credentials.sh
   ```

2. **Setup EC2 Instance**
   ```bash
   # SSH into your EC2
   ssh -i your-key.pem ec2-user@YOUR_EC2_IP
   
   # Run setup script
   ./setup-ec2.sh
   ```

3. **Deploy Application**
   ```bash
   # From your local machine
   git push origin master
   ```

### Updating Credentials

If you need to update credentials later:

**Option 1: Re-run setup script**
```powershell
.\scripts\setup-credentials.ps1
```

**Option 2: Update GitHub Secrets manually**
- Go to: https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions
- Update individual secrets

**Option 3: Use GitHub CLI**
```bash
gh secret set AWS_REGION -b "us-west-2"
```

---

## 🔒 Security Notes

### Credentials Storage

- **GitHub Secrets**: All 9 credentials (used by CI/CD)
- **Local .env files**: Supabase credentials (used for local dev)
- **EC2 Instance**: Credentials embedded in Docker image

### Best Practices

✅ **DO:**
- Use the automated setup scripts
- Keep `.pem` files secure with `chmod 400`
- Rotate AWS credentials every 90 days
- Use Elastic IP for EC2
- Enable CloudTrail logging

❌ **DON'T:**
- Commit `.env` files to git
- Share credentials via email/chat
- Use root AWS credentials
- Hardcode secrets in code
- Reuse credentials across projects

---

## 📖 Documentation

- **[Automated Setup Guide](../SETUP.md)** - Complete setup walkthrough
- **[Credentials Guide](../docs/CREDENTIALS_GUIDE.md)** - Credential reference with diagrams
- **[AWS Deployment Guide](../docs/AWS_DEPLOYMENT_GUIDE.md)** - Full deployment documentation
- **[Deployment Checklist](../docs/DEPLOYMENT_CHECKLIST.md)** - Manual setup checklist

---

## 🆘 Troubleshooting

### PowerShell Execution Policy Error

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
.\scripts\setup-credentials.ps1
```

### Bash Script Won't Run

```bash
chmod +x ./scripts/setup-credentials.sh
./scripts/setup-credentials.sh
```

### GitHub CLI Not Found

The scripts work without GitHub CLI, but you'll need to add secrets manually:
1. Scripts will save credentials to `github-secrets.txt`
2. Copy values to GitHub manually
3. Delete the backup file after use

### SSH Key Issues

- Ensure correct path to `.pem` file
- Check permissions: `chmod 400 your-key.pem` (Linux/macOS)
- Use absolute path when prompted

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Setup credentials (Windows) | `.\scripts\setup-credentials.ps1` |
| Setup credentials (Linux/macOS) | `./scripts/setup-credentials.sh` |
| Setup EC2 instance | `./setup-ec2.sh` (on EC2) |
| View GitHub secrets | `gh secret list` |
| Add single secret | `gh secret set SECRET_NAME` |
| Delete secret | `gh secret delete SECRET_NAME` |

---

**Need help? See the [Complete Setup Guide](../SETUP.md)** 🚀

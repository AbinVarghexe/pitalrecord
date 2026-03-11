# 🔑 Credentials Overview

This document shows all required credentials and where they are used in the deployment pipeline.

## Quick Reference

| Credential | Where Used | Purpose |
|------------|-----------|---------|
| `AWS_ACCESS_KEY_ID` | GitHub Actions | Authenticate to AWS |
| `AWS_SECRET_ACCESS_KEY` | GitHub Actions | Authenticate to AWS |
| `AWS_REGION` | GitHub Actions, EC2 | AWS region for resources |
| `ECR_REPOSITORY_NAME` | GitHub Actions | Container image repository |
| `EC2_HOST` | GitHub Actions | EC2 instance IP/hostname |
| `EC2_USER` | GitHub Actions | SSH username for EC2 |
| `EC2_SSH_PRIVATE_KEY` | GitHub Actions | SSH private key content |
| `NEXT_PUBLIC_SUPABASE_URL` | Next.js App, GitHub Actions | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Next.js App, GitHub Actions | Supabase public API key |

## Credential Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    GitHub Repository                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GitHub Secrets (9 credentials)                          │  │
│  │  • AWS_ACCESS_KEY_ID                                     │  │
│  │  • AWS_SECRET_ACCESS_KEY                                 │  │
│  │  • AWS_REGION                                            │  │
│  │  • ECR_REPOSITORY_NAME                                   │  │
│  │  • EC2_HOST                                              │  │
│  │  • EC2_USER                                              │  │
│  │  • EC2_SSH_PRIVATE_KEY                                   │  │
│  │  • NEXT_PUBLIC_SUPABASE_URL                             │  │
│  │  • NEXT_PUBLIC_SUPABASE_ANON_KEY                        │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│                   ▼                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  GitHub Actions Workflow (.github/workflows/deploy.yml)  │  │
│  │                                                           │  │
│  │  Step 1: Configure AWS Credentials ────────────────────► │  │
│  │          Uses: AWS_ACCESS_KEY_ID                         │  │
│  │                AWS_SECRET_ACCESS_KEY                     │  │
│  │                AWS_REGION                                │  │
│  │                                                           │  │
│  │  Step 2: Build Docker Image ───────────────────────────► │  │
│  │          Injects: NEXT_PUBLIC_SUPABASE_URL              │  │
│  │                   NEXT_PUBLIC_SUPABASE_ANON_KEY         │  │
│  │                                                           │  │
│  │  Step 3: Push to ECR ──────────────────────────────────► │  │
│  │          Uses: ECR_REPOSITORY_NAME                       │  │
│  │                                                           │  │
│  │  Step 4: Deploy to EC2 ────────────────────────────────► │  │
│  │          Uses: EC2_HOST                                  │  │
│  │                EC2_USER                                  │  │
│  │                EC2_SSH_PRIVATE_KEY                       │  │
│  └────────────────┬─────────────────────────────────────────┘  │
└───────────────────┼──────────────────────────────────────────────┘
                    │
                    │ SSH Connection
                    │
                    ▼
    ┌────────────────────────────────────────────┐
    │         AWS EC2 Instance                   │
    │                                             │
    │  1. Pull Docker image from ECR             │
    │  2. Stop old container                     │
    │  3. Start new container with updated image │
    │  4. NGINX proxies traffic to container     │
    │                                             │
    │  Container Environment:                    │
    │  • NEXT_PUBLIC_SUPABASE_URL (from build)  │
    │  • NEXT_PUBLIC_SUPABASE_ANON_KEY (build)  │
    └────────────────────────────────────────────┘
                    │
                    │ API Calls
                    │
                    ▼
    ┌────────────────────────────────────────────┐
    │         Supabase                           │
    │                                             │
    │  • Authentication                          │
    │  • PostgreSQL Database                     │
    │  • Row Level Security                      │
    │                                             │
    │  Configured with:                          │
    │  • NEXT_PUBLIC_SUPABASE_URL               │
    │  • NEXT_PUBLIC_SUPABASE_ANON_KEY          │
    └────────────────────────────────────────────┘
```

## Where to Get Each Credential

### 1. AWS Credentials (AWS IAM Console)

**Location:** https://console.aws.amazon.com/iam/

#### AWS_ACCESS_KEY_ID & AWS_SECRET_ACCESS_KEY
1. Go to IAM → Users → Create User
2. User name: `github-actions-pitalrecord`
3. Enable "Programmatic access"
4. Attach policies:
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AmazonEC2FullAccess` (or custom policy with EC2 read/deploy permissions)
5. Download the credentials (shown only once!)

#### AWS_REGION
- Choose the region where you'll deploy
- Common values: `us-east-1`, `us-west-2`, `eu-west-1`, `ap-southeast-1`
- Must match your EC2 and ECR region

### 2. ECR Repository (AWS ECR Console)

**Location:** https://console.aws.amazon.com/ecr/

#### ECR_REPOSITORY_NAME
1. Go to ECR → Repositories → Create repository
2. Name: `pitalrecord-web` (recommended)
3. Keep as Private repository
4. Note the repository name (not the full URI)

### 3. EC2 Instance (AWS EC2 Console)

**Location:** https://console.aws.amazon.com/ec2/

#### EC2_HOST
- Your EC2 instance's public IP or Elastic IP
- Example: `54.123.45.67`
- Or hostname: `ec2-54-123-45-67.compute-1.amazonaws.com`
- Find it: EC2 → Instances → Select instance → Copy "Public IPv4 address"

#### EC2_USER
- Depends on your AMI:
  - Amazon Linux 2/2023: `ec2-user`
  - Ubuntu: `ubuntu`
  - Debian: `admin`
  - CentOS: `centos`

#### EC2_SSH_PRIVATE_KEY
- The private key (.pem file) downloaded when creating the EC2 instance
- Full content of the file, including:
  ```
  -----BEGIN RSA PRIVATE KEY-----
  [key content]
  -----END RSA PRIVATE KEY-----
  ```
- Keep this secure! Never commit to git

### 4. Supabase Credentials (Supabase Dashboard)

**Location:** https://app.supabase.com

#### NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY
1. Select your project
2. Go to Project Settings (gear icon) → API
3. Copy:
   - **Project URL** → Use as `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → Use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Security Best Practices

### ✅ DO

- ✅ Store credentials in GitHub Secrets (never in code)
- ✅ Use environment variables for sensitive data
- ✅ Rotate AWS credentials regularly (every 90 days)
- ✅ Use IAM policies with least privilege
- ✅ Keep `.pem` files secure with `chmod 400`
- ✅ Use Elastic IP for EC2 (prevents IP changes)
- ✅ Enable CloudTrail for AWS API logging
- ✅ Use Supabase Row Level Security (RLS)

### ❌ DON'T

- ❌ Commit `.env` files to git
- ❌ Share credentials via email or chat
- ❌ Use root AWS credentials
- ❌ Hardcode secrets in code
- ❌ Push `.pem` files to repository
- ❌ Share the same credentials across projects
- ❌ Use public Supabase service role keys in frontend

## Credential Storage Locations

### GitHub Repository Secrets
**Purpose:** Used by GitHub Actions during CI/CD
**Location:** `https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions`
**Contains:** All 9 credentials

### Local Development (.env files)
**Purpose:** Used for local development
**Location:** 
- Root: `.env`
- Web app: `apps/web/.env.local`
**Contains:** 
- Supabase credentials
- (Optional) AWS credentials for local testing

### EC2 Instance
**Purpose:** Docker containers and AWS CLI
**Location:** `/home/ec2-user/pitalrecord/.env`
**Contains:**
- Supabase credentials (baked into Docker image)
- AWS credentials (for AWS CLI on EC2)

### Docker Image (Build-time)
**Purpose:** Embedded in the built Next.js application
**Contains:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
**Note:** These are "public" environment variables (prefixed with `NEXT_PUBLIC_`)

## Automated Setup

Instead of manually collecting these credentials, use our automated setup wizard:

### Windows (PowerShell)
```powershell
.\scripts\setup-credentials.ps1
```

### Linux/macOS (Bash)
```bash
chmod +x ./scripts/setup-credentials.sh
./scripts/setup-credentials.sh
```

The wizard will:
1. Prompt you for each credential with helpful descriptions
2. Create `.env` files automatically
3. Add secrets to GitHub (if GitHub CLI installed)
4. Validate your configuration
5. Save a backup file for manual setup

See [SETUP.md](../SETUP.md) for complete details.

## Verification Checklist

After setting up credentials:

- [ ] All 9 GitHub secrets are added
- [ ] `.env` file exists in project root
- [ ] `apps/web/.env.local` file exists
- [ ] EC2 instance is accessible via SSH
- [ ] ECR repository is created
- [ ] Supabase project is active
- [ ] IAM user has correct permissions
- [ ] Security groups allow ports 22, 80, 443
- [ ] Test local development: `pnpm dev`
- [ ] Test GitHub Actions: Push to master branch

## Troubleshooting

### GitHub Actions failing at "Configure AWS credentials"
- Check `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are correct
- Verify IAM user has ECR and EC2 permissions

### GitHub Actions failing at "Push to ECR"
- Check `ECR_REPOSITORY_NAME` matches your ECR repository
- Ensure ECR repository exists in the correct region
- Verify `AWS_REGION` is correct

### GitHub Actions failing at "Deploy to EC2"
- Check `EC2_HOST` is the correct public IP
- Verify `EC2_USER` matches your AMI (usually `ec2-user`)
- Ensure `EC2_SSH_PRIVATE_KEY` contains complete .pem file content
- Check EC2 security group allows SSH from GitHub Actions IPs

### Application not connecting to Supabase
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Check `NEXT_PUBLIC_SUPABASE_ANON_KEY` is the anon/public key (not service role)
- Ensure Supabase project is active

### Local development issues
- Check `.env` and `apps/web/.env.local` exist
- Verify environment variables are loaded: `echo $NEXT_PUBLIC_SUPABASE_URL`
- Restart development server after changing `.env`

## Need Help?

1. Run the automated setup: [SETUP.md](../SETUP.md)
2. Check the deployment guide: [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)
3. Review the checklist: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
4. Open an issue with error details (redact sensitive values!)

---

**Remember:** Keep credentials secure, rotate regularly, and never commit to git! 🔒

# AWS EC2 Deployment Guide for PitalRecord

This guide walks you through deploying the PitalRecord application to AWS EC2 with automated CI/CD using GitHub Actions, Docker, and NGINX.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [AWS Setup](#aws-setup)
3. [GitHub Secrets Configuration](#github-secrets-configuration)
4. [EC2 Instance Setup](#ec2-instance-setup)
5. [Local Testing](#local-testing)
6. [Deployment Process](#deployment-process)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before starting, ensure you have:
- AWS Account with appropriate permissions
- GitHub repository access
- Domain name (optional, for custom domain)
- Supabase project credentials

### 🤖 Optional: AWS MCP Server Integration

For an enhanced development experience with AI assistants (Claude Desktop, Cline, Cursor, VS Code Copilot), consider setting up AWS MCP servers. This allows you to interact with AWS services through natural language commands.

**See the dedicated guide:** [AWS MCP Integration Guide](./AWS_MCP_INTEGRATION.md)

**Key Benefits:**
- ✅ Create and manage AWS resources through AI commands
- ✅ Generate Infrastructure as Code (CloudFormation/CDK)
- ✅ Validate deployment configurations
- ✅ Estimate infrastructure costs
- ✅ Troubleshoot issues with AI assistance

**Quick Setup:**
```bash
# Install UV package manager
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install Python
uv python install 3.10

# Install AWS API MCP Server
uv tool install awslabs.aws-api-mcp-server

# Install AWS IaC MCP Server (for CloudFormation/CDK)
uv tool install awslabs.iac-mcp-server
```

Then configure your AI assistant with the MCP server settings from the [integration guide](./AWS_MCP_INTEGRATION.md).

## AWS Setup

### 1. Create IAM User for GitHub Actions

1. Go to AWS IAM Console
2. Create a new user: `github-actions-deploy`
3. Attach the following policies:
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AmazonEC2FullAccess` (or custom policy with EC2 describe permissions)

4. Create access keys and save them securely:
   - **AWS_ACCESS_KEY_ID**
   - **AWS_SECRET_ACCESS_KEY**

### 2. Create ECR Repository

```bash
# Using AWS CLI
aws ecr create-repository --repository-name pitalrecord-web --region us-east-1

# Save the repository URI (you'll need this later)
```

Or via AWS Console:
1. Go to Amazon ECR
2. Click "Create repository"
3. Name: `pitalrecord-web`
4. Keep default settings
5. Click "Create repository"
6. Note the repository URI

### 3. Launch EC2 Instance

1. **Go to EC2 Console** → Launch Instance

2. **Choose AMI:**
   - Amazon Linux 2023 (recommended)
   - OR Ubuntu 22.04 LTS

3. **Instance Type:**
   - Minimum: t2.small (2GB RAM)
   - Recommended: t3.medium (4GB RAM)

4. **Key Pair:**
   - Create new key pair: `pitalrecord-ec2-key`
   - Download and save `.pem` file securely

5. **Network Settings:**
   - Create security group with rules:
     - SSH (22) - Your IP only
     - HTTP (80) - Anywhere (0.0.0.0/0)
     - HTTPS (443) - Anywhere (0.0.0.0/0)

6. **Storage:**
   - 20-30 GB gp3

7. **Advanced Details:**
   - IAM instance profile: Create one with `AmazonEC2ContainerRegistryReadOnly` policy

8. **Launch Instance**

9. **Allocate Elastic IP** (recommended):
   ```bash
   # Via AWS CLI
   aws ec2 allocate-address --domain vpc
   aws ec2 associate-address --instance-id i-xxxxx --allocation-id eipalloc-xxxxx
   ```

## GitHub Secrets Configuration

Add the following secrets to your GitHub repository:

Go to Repository → Settings → Secrets and variables → Actions → New repository secret

### Required Secrets:

| Secret Name | Description | Example |
|-------------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | IAM user access key ID | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | IAM user secret access key | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region for ECR & EC2 | `us-east-1` |
| `ECR_REPOSITORY_NAME` | ECR repository name | `pitalrecord-web` |
| `EC2_HOST` | EC2 instance public IP or domain | `54.123.45.67` |
| `EC2_USER` | EC2 SSH username | `ec2-user` (Amazon Linux) or `ubuntu` |
| `EC2_SSH_PRIVATE_KEY` | Private key (.pem) content | `-----BEGIN RSA PRIVATE KEY-----...` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### How to add EC2_SSH_PRIVATE_KEY:

```bash
# On Windows (PowerShell)
Get-Content pitalrecord-ec2-key.pem | Set-Clipboard

# On Linux/Mac
cat pitalrecord-ec2-key.pem | pbcopy  # Mac
cat pitalrecord-ec2-key.pem | xclip   # Linux
```

Paste the entire content (including BEGIN and END lines) into the secret value.

## EC2 Instance Setup

### 1. Connect to EC2

```bash
# Change key permissions (Linux/Mac)
chmod 400 pitalrecord-ec2-key.pem

# Connect via SSH
ssh -i pitalrecord-ec2-key.pem ec2-user@YOUR_EC2_IP
```

### 2. Run Setup Script

```bash
# Copy the setup script to EC2
scp -i pitalrecord-ec2-key.pem scripts/setup-ec2.sh ec2-user@YOUR_EC2_IP:~

# SSH into EC2 and run
ssh -i pitalrecord-ec2-key.pem ec2-user@YOUR_EC2_IP
chmod +x setup-ec2.sh
./setup-ec2.sh

# Log out and log back in for Docker group to take effect
exit
ssh -i pitalrecord-ec2-key.pem ec2-user@YOUR_EC2_IP
```

### 3. Configure Environment

```bash
cd ~/pitalrecord

# Edit .env file
nano .env
```

Add your actual values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NODE_ENV=production

# Add ECR details
ECR_REGISTRY=123456789012.dkr.ecr.us-east-1.amazonaws.com
ECR_REPOSITORY=pitalrecord-web
```

### 4. Configure AWS Credentials on EC2

```bash
aws configure
# Enter:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region (e.g., us-east-1)
# - Output format: json
```

### 5. Login to ECR

```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_REGISTRY
```

## Local Testing

Before deploying to production, test Docker build locally:

```bash
# Build Docker image
docker build -t pitalrecord-web:test \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=your_url \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  .

# Test locally
docker run -p 3000:3000 pitalrecord-web:test

# Or use docker-compose
docker-compose up
```

Visit `http://localhost:3000` to verify.

## Deployment Process

### Automatic Deployment (Recommended)

Once everything is configured, simply push to your main branch:

```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

GitHub Actions will automatically:
1. Build the Docker image
2. Push to ECR
3. Deploy to EC2
4. Restart containers
5. Verify deployment

### Manual Deployment

If needed, you can deploy manually on EC2:

```bash
cd ~/pitalrecord

# Pull latest image
docker-compose pull

# Restart services
docker-compose down
docker-compose up -d

# Check logs
docker-compose logs -f
```

## Monitoring

### Check Application Status

```bash
# View running containers
docker ps

# View logs
docker logs pitalrecord-web -f
docker logs pitalrecord-nginx -f

# Check application health
curl http://localhost:3000
curl http://localhost
```

### GitHub Actions Status

Monitor deployments at:
```
https://github.com/YOUR_USERNAME/pitalrecord/actions
```

## Custom Domain Setup (Optional)

### 1. Configure DNS

In your domain registrar, add an A record:
```
Type: A
Name: @ (or subdomain)
Value: YOUR_EC2_ELASTIC_IP
TTL: 300
```

### 2. Install SSL Certificate (Let's Encrypt)

```bash
# On EC2
sudo yum install -y certbot python3-certbot-nginx  # Amazon Linux
# OR
sudo apt-get install -y certbot python3-certbot-nginx  # Ubuntu

# Get certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### 3. Update NGINX Configuration

Edit `nginx/nginx.conf` to uncomment the HTTPS section and update domain name.

## Troubleshooting

### Build Fails

```bash
# Check build logs in GitHub Actions
# Verify Supabase credentials are correct
# Ensure all dependencies are properly listed
```

### Deployment Fails

```bash
# SSH into EC2 and check:
docker ps -a
docker logs pitalrecord-web

# Check disk space
df -h

# Check if ECR login is valid
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_REGISTRY
```

### Application Not Accessible

```bash
# Check security group rules (ports 80, 443)
# Verify NGINX is running
docker logs pitalrecord-nginx

# Check if app is listening
curl http://localhost:3000
```

### Out of Memory

```bash
# Upgrade instance type to t3.medium or larger
# Or add swap space:
sudo dd if=/dev/zero of=/swapfile bs=1G count=2
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

## Cost Estimation

Monthly AWS costs (approximate):
- EC2 t3.small: ~$15-20/month
- ECR storage: ~$1-5/month
- Data transfer: ~$1-10/month
- Elastic IP (if used): Free when attached

**Total: ~$20-40/month**

## Security Best Practices

1. ✅ Use Elastic IP
2. ✅ Enable AWS CloudWatch for monitoring
3. ✅ Regular security updates: `sudo yum update -y`
4. ✅ Use SSL certificates (Let's Encrypt)
5. ✅ Restrict SSH access to your IP only
6. ✅ Use secrets for sensitive data
7. ✅ Enable CloudWatch logs
8. ✅ Set up automated backups

## Support

For issues:
1. Check GitHub Actions logs
2. Check EC2 instance logs
3. Review Docker container logs
4. Check AWS CloudWatch

---

**Last Updated:** 2026-03-11

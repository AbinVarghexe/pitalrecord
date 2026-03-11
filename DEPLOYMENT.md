# AWS Deployment Guide

This guide explains how to deploy PitalRecord to AWS using Docker and the CI/CD pipeline.

## Architecture Overview

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   GitHub        │─────▶│   AWS ECR       │─────▶│   AWS EC2       │
│   (Source)      │      │   (Registry)    │      │   (Runtime)     │
└─────────────────┘      └─────────────────┘      └─────────────────┘
        │                                                  │
        │ Push to main/master                              │
        ▼                                                  ▼
┌─────────────────┐                              ┌─────────────────┐
│ GitHub Actions  │                              │ Docker Container│
│ CI/CD Pipeline  │                              │ (Next.js App)   │
└─────────────────┘                              └─────────────────┘
```

## Prerequisites

### 1. AWS Setup

1. **Create an AWS Account** (if you don't have one)

2. **Create an IAM User** with the following permissions:
   - `AmazonEC2ContainerRegistryFullAccess`
   - `AmazonEC2FullAccess` (or specific EC2 permissions)
   
3. **Create Access Keys** for the IAM user and save them securely

4. **Create an ECR Repository**:
   ```bash
   aws ecr create-repository --repository-name pitalrecord --region us-east-1
   ```

5. **Launch an EC2 Instance**:
   - AMI: Amazon Linux 2 or Ubuntu
   - Instance type: t2.micro (free tier) or larger
   - Security Group: Allow inbound HTTP (80), HTTPS (443), SSH (22)
   - Key pair: Create or use existing for SSH access

### 2. GitHub Secrets

Add these secrets to your GitHub repository (`Settings → Secrets and variables → Actions`):

| Secret Name | Description |
|-------------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM access key |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM secret key |
| `EC2_HOST` | EC2 public IP or domain |
| `EC2_USER` | EC2 SSH user (e.g., `ec2-user` or `ubuntu`) |
| `EC2_SSH_KEY` | EC2 private key (PEM format) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

### 3. EC2 Initial Setup

SSH into your EC2 instance and run the setup script:

```bash
# Download and run setup script
curl -O https://raw.githubusercontent.com/AbinVarghexe/pitalrecord/main/scripts/ec2-setup.sh
chmod +x ec2-setup.sh
./ec2-setup.sh

# Configure AWS credentials
aws configure
```

## CI/CD Pipeline

The pipeline is triggered automatically on:
- Push to `main` or `master` branch
- Manual trigger via GitHub Actions

### Pipeline Jobs

1. **Build & Test**: Linting, type checking, and build verification
2. **Docker Build & Push**: Builds Docker image and pushes to ECR
3. **Deploy to EC2**: Pulls image and runs container on EC2

### Manual Deployment

You can also deploy manually from the EC2 instance:

```bash
cd /opt/pitalrecord
./scripts/deploy.sh
```

## Local Development with Docker

```bash
# Build and run locally
docker-compose up --build

# Run with nginx (production profile)
docker-compose --profile production up --build
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
# Edit .env with your values
```

## Monitoring

### Check container status:
```bash
docker ps
docker logs pitalrecord-web
```

### View resource usage:
```bash
docker stats pitalrecord-web
```

### Health check:
```bash
curl http://localhost/health
```

## Troubleshooting

### Container won't start
```bash
docker logs pitalrecord-web
```

### Permission denied with Docker
```bash
sudo usermod -aG docker $USER
# Log out and back in
```

### ECR login issues
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
```

### Out of disk space
```bash
docker system prune -af
```

## Cost Optimization

- Use `t2.micro` for low-traffic applications (free tier eligible)
- Set up auto-stop for development environments
- Use ECR lifecycle policies to clean old images:
  ```bash
  aws ecr put-lifecycle-policy --repository-name pitalrecord --lifecycle-policy-text '{"rules":[{"rulePriority":1,"description":"Keep last 5 images","selection":{"tagStatus":"any","countType":"imageCountMoreThan","countNumber":5},"action":{"type":"expire"}}]}'
  ```

## Security Best Practices

1. Use secrets manager for sensitive environment variables
2. Enable ECR image scanning
3. Use non-root user in Docker container
4. Keep Docker and dependencies updated
5. Use security groups to restrict access
6. Enable CloudWatch logging for monitoring

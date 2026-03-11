# 🚀 Quick Setup Checklist

Use this checklist to gather all required information before deployment.

## ☑️ AWS Credentials

### IAM User for GitHub Actions
- [ ] **AWS Access Key ID:** `_________________________`
- [ ] **AWS Secret Access Key:** `_________________________`
- [ ] **AWS Region:** `_________________________` (e.g., us-east-1)

### ECR (Elastic Container Registry)
- [ ] **ECR Repository Name:** `pitalrecord-web`
- [ ] **ECR Registry URI:** `_________________________.dkr.ecr.us-east-1.amazonaws.com`

### EC2 Instance
- [ ] **EC2 Public IP/Elastic IP:** `_________________________`
- [ ] **EC2 Instance ID:** `i-_________________________`
- [ ] **EC2 User:** `ec2-user` (Amazon Linux) or `ubuntu`
- [ ] **SSH Private Key (.pem):** Saved at `_________________________`
- [ ] **Security Group ID:** `sg-_________________________`
  - [ ] Port 22 (SSH) - Your IP
  - [ ] Port 80 (HTTP) - 0.0.0.0/0
  - [ ] Port 443 (HTTPS) - 0.0.0.0/0

## ☑️ Supabase Credentials

- [ ] **Supabase Project URL:** `https://_________________________.supabase.co`
- [ ] **Supabase Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9._________________________`

### Where to find:
1. Go to https://app.supabase.com
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

## ☑️ GitHub Repository Secrets

Add these secrets to: Repository → Settings → Secrets and variables → Actions

- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_REGION`
- [ ] `ECR_REPOSITORY_NAME`
- [ ] `EC2_HOST`
- [ ] `EC2_USER`
- [ ] `EC2_SSH_PRIVATE_KEY` (entire .pem file content)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## ☑️ Domain Configuration (Optional)

- [ ] **Domain Name:** `_________________________`
- [ ] **DNS Provider:** `_________________________`
- [ ] **A Record configured:** Points to EC2 Elastic IP
- [ ] **SSL Certificate:** Will be configured with Let's Encrypt

## 🔧 Setup Steps Order

Follow these steps in order:

### 1. AWS Setup (30-45 minutes)
- [ ] Create IAM user with programmatic access
- [ ] Create ECR repository
- [ ] Launch EC2 instance (t3.small or larger)
- [ ] Allocate and associate Elastic IP
- [ ] Configure security groups
- [ ] Create IAM role for EC2 with ECR read access

### 2. GitHub Configuration (10 minutes)
- [ ] Add all secrets to GitHub repository
- [ ] Verify secrets are saved correctly

### 3. EC2 Instance Setup (20-30 minutes)
- [ ] SSH into EC2
- [ ] Copy and run setup-ec2.sh script
- [ ] Configure AWS credentials on EC2
- [ ] Login to ECR
- [ ] Edit .env file with production values

### 4. First Deployment (15-20 minutes)
- [ ] Push code to main/master branch
- [ ] Monitor GitHub Actions workflow
- [ ] Verify deployment succeeded
- [ ] Test application accessibility

### 5. Post-Deployment (15 minutes)
- [ ] Configure custom domain (if applicable)
- [ ] Set up SSL with Let's Encrypt
- [ ] Test application functionality
- [ ] Set up monitoring/alerts

## 📝 Important Commands Reference

### SSH into EC2
```bash
ssh -i pitalrecord-ec2-key.pem ec2-user@YOUR_EC2_IP
```

### Login to ECR from EC2
```bash
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ECR_REGISTRY
```

### View Logs
```bash
docker logs pitalrecord-web -f
docker logs pitalrecord-nginx -f
```

### Restart Services
```bash
cd ~/pitalrecord
docker-compose down
docker-compose up -d
```

## 🆘 Quick Troubleshooting

| Issue | Quick Fix |
|-------|-----------|
| Build fails | Check Supabase credentials in GitHub secrets |
| Can't SSH | Check security group port 22 rules |
| Site not accessible | Check security group ports 80/443 |
| Container crashes | Check logs: `docker logs pitalrecord-web` |
| Out of memory | Upgrade to t3.medium instance |

## ✅ Verification Checklist

After deployment, verify:
- [ ] Application loads at `http://YOUR_EC2_IP`
- [ ] NGINX reverse proxy working
- [ ] Supabase authentication working
- [ ] No errors in container logs
- [ ] GitHub Actions workflow successful
- [ ] Auto-deployment on push works

## 🔗 Helpful Links

- **AWS EC2 Console:** https://console.aws.amazon.com/ec2/
- **AWS ECR Console:** https://console.aws.amazon.com/ecr/
- **AWS IAM Console:** https://console.aws.amazon.com/iam/
- **Supabase Dashboard:** https://app.supabase.com/
- **GitHub Actions:** https://github.com/YOUR_USERNAME/pitalrecord/actions
- **Docker Hub:** https://hub.docker.com/ (alternative to ECR)

## 📞 Need Help?

Refer to the full deployment guide: [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)

---

**Estimated Total Setup Time:** 90-120 minutes

**Next:** Follow [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for detailed instructions.

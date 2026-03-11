# 🚀 Quick Command Reference

## Local Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build production
pnpm build

# Lint code
pnpm lint
```

## Docker Commands

### Build & Run Locally
```bash
# Build Docker image
docker build -t pitalrecord-web:test \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=your_url \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  .

# Run container
docker run -p 3000:3000 pitalrecord-web:test

# Or use docker-compose
docker-compose up

# Run in background
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

## AWS Commands

### ECR (Container Registry)
```bash
# Create ECR repository
aws ecr create-repository --repository-name pitalrecord-web --region us-east-1

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ECR_REGISTRY

# Push image to ECR
docker tag pitalrecord-web:latest YOUR_ECR_REGISTRY/pitalrecord-web:latest
docker push YOUR_ECR_REGISTRY/pitalrecord-web:latest
```

### EC2 Instance
```bash
# SSH into EC2
ssh -i pitalrecord-ec2-key.pem ec2-user@YOUR_EC2_IP

# Copy file to EC2
scp -i pitalrecord-ec2-key.pem file.txt ec2-user@YOUR_EC2_IP:~/

# Copy directory to EC2
scp -i pitalrecord-ec2-key.pem -r folder/ ec2-user@YOUR_EC2_IP:~/

# Get EC2 instance info
aws ec2 describe-instances --instance-ids i-xxxxx

# Allocate Elastic IP
aws ec2 allocate-address --domain vpc

# Associate Elastic IP
aws ec2 associate-address --instance-id i-xxxxx --allocation-id eipalloc-xxxxx
```

## On EC2 Instance

### Setup
```bash
# Run setup script (first time only)
chmod +x setup-ec2.sh
./setup-ec2.sh

# Configure AWS credentials
aws configure

# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin YOUR_ECR_REGISTRY
```

### Deployment
```bash
# Navigate to app directory
cd ~/pitalrecord

# Pull latest image
docker-compose pull

# Restart services
docker-compose down
docker-compose up -d

# View logs
docker logs pitalrecord-web -f
docker logs pitalrecord-nginx -f

# Check running containers
docker ps

# Check all containers
docker ps -a
```

### Troubleshooting on EC2
```bash
# Check container status
docker ps -a

# View logs
docker logs pitalrecord-web --tail 100
docker logs pitalrecord-nginx --tail 100

# Enter container shell
docker exec -it pitalrecord-web sh

# Check disk space
df -h

# Check memory usage
free -h

# Restart Docker daemon
sudo systemctl restart docker

# Clean up Docker
docker system prune -a
docker volume prune
```

## GitHub Actions

### Trigger Deployment
```bash
# Automatic deployment on push
git add .
git commit -m "Deploy changes"
git push origin main

# View workflow status
# Go to: https://github.com/YOUR_USERNAME/pitalrecord/actions
```

### Manual Workflow Trigger
```bash
# Via GitHub CLI (if installed)
gh workflow run deploy.yml

# Or use GitHub UI:
# Actions → Deploy to AWS EC2 → Run workflow
```

## NGINX Commands (on EC2)

```bash
# View NGINX logs
docker logs pitalrecord-nginx -f

# Test NGINX config
docker exec pitalrecord-nginx nginx -t

# Reload NGINX config
docker exec pitalrecord-nginx nginx -s reload

# Restart NGINX container
docker restart pitalrecord-nginx
```

## Monitoring & Health Checks

```bash
# Check if app is responding
curl http://localhost:3000
curl http://localhost

# Check from outside EC2
curl http://YOUR_EC2_IP

# Check application health
curl http://YOUR_EC2_IP/health

# Watch logs in real-time
docker logs pitalrecord-web -f --tail 50
```

## Git Commands

```bash
# Check current branch
git branch

# Create new branch
git checkout -b feature-name

# Push new branch
git push -u origin feature-name

# Pull latest changes
git pull origin main

# View commit history
git log --oneline -10

# Check git status
git status
```

## Environment Variables

### View on EC2
```bash
cd ~/pitalrecord
cat .env
```

### Edit on EC2
```bash
nano .env
# Make changes, then Ctrl+X, Y, Enter to save

# Restart containers for changes to take effect
docker-compose down
docker-compose up -d
```

## SSL Certificate (Let's Encrypt)

```bash
# Install certbot (on EC2)
sudo yum install -y certbot python3-certbot-nginx  # Amazon Linux
# OR
sudo apt-get install -y certbot python3-certbot-nginx  # Ubuntu

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Renew certificate manually
sudo certbot renew
```

## Backup & Restore

### Backup
```bash
# Backup .env file
scp -i pitalrecord-ec2-key.pem ec2-user@YOUR_EC2_IP:~/pitalrecord/.env ./backup-env

# Backup Docker volumes (if any)
docker run --rm -v pitalrecord_data:/data -v $(pwd):/backup alpine tar czf /backup/data-backup.tar.gz /data
```

### Restore
```bash
# Restore .env file
scp -i pitalrecord-ec2-key.pem ./backup-env ec2-user@YOUR_EC2_IP:~/pitalrecord/.env
```

## Security Updates

```bash
# Update system packages (on EC2)
sudo yum update -y  # Amazon Linux
# OR
sudo apt-get update && sudo apt-get upgrade -y  # Ubuntu

# Update Docker images
docker-compose pull
docker-compose up -d

# Remove old images
docker image prune -a
```

## Performance Monitoring

```bash
# Check CPU & memory usage
docker stats

# Check disk I/O
iostat -x 1

# Check network
netstat -tupln

# Check logs size
du -sh /var/lib/docker/containers/*/
```

## Useful Aliases (Add to ~/.bashrc on EC2)

```bash
# Edit ~/.bashrc
nano ~/.bashrc

# Add these aliases:
alias dc='docker-compose'
alias dps='docker ps'
alias dlogs='docker logs -f'
alias dstop='docker-compose down'
alias dstart='docker-compose up -d'
alias drestart='docker-compose restart'
alias app='cd ~/pitalrecord'

# Save and reload
source ~/.bashrc
```

## Emergency Commands

```bash
# Stop all containers
docker stop $(docker ps -aq)

# Remove all containers
docker rm $(docker ps -aq)

# Kill all Docker processes
sudo killall docker
sudo systemctl restart docker

# Reboot EC2 instance
sudo reboot

# Check system logs
sudo journalctl -xe
```

## Cost Management

```bash
# Check ECR storage usage
aws ecr describe-repositories --region us-east-1

# List all images in ECR
aws ecr list-images --repository-name pitalrecord-web --region us-east-1

# Delete old images from ECR
aws ecr batch-delete-image \
  --repository-name pitalrecord-web \
  --image-ids imageTag=old-tag \
  --region us-east-1
```

---

**💡 Tip:** Bookmark this page for quick reference!

**🔗 Related:**
- [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) - Full guide
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Setup checklist
- [DEPLOYMENT_READY.md](./DEPLOYMENT_READY.md) - Project summary

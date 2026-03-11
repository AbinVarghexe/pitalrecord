#!/bin/bash

# EC2 instance setup script for PitalRecord
# Run this script on your EC2 instance after initial setup

set -e

echo "========================================="
echo "PitalRecord EC2 Setup Script"
echo "========================================="

# Update system
echo "Updating system packages..."
sudo yum update -y || sudo apt-get update -y

# Install Docker
echo "Installing Docker..."
if ! command -v docker &> /dev/null; then
    # For Amazon Linux 2
    if [ -f /etc/amazon-linux-release ]; then
        sudo yum install -y docker
        sudo service docker start
        sudo systemctl enable docker
        sudo usermod -a -G docker ec2-user
    # For Ubuntu
    else
        sudo apt-get install -y docker.io
        sudo systemctl start docker
        sudo systemctl enable docker
        sudo usermod -a -G docker ubuntu
    fi
else
    echo "Docker already installed"
fi

# Install Docker Compose
echo "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose already installed"
fi

# Install AWS CLI
echo "Installing AWS CLI..."
if ! command -v aws &> /dev/null; then
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
else
    echo "AWS CLI already installed"
fi

# Create application directory
echo "Creating application directory..."
APP_DIR="/home/${USER}/pitalrecord"
mkdir -p $APP_DIR
cd $APP_DIR

# Create .env file
echo "Creating environment file..."
cat > .env << 'ENVEOF'
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Node Environment
NODE_ENV=production
ENVEOF

echo ""
echo "⚠️  IMPORTANT: Edit the .env file with your actual values:"
echo "   nano $APP_DIR/.env"
echo ""

# Create docker-compose.yml for EC2
cat > docker-compose.yml << 'COMPOSEEOF'
version: '3.8'

services:
  web:
    image: ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
    container_name: pitalrecord-web
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
    networks:
      - pitalrecord-network
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  nginx:
    image: nginx:alpine
    container_name: pitalrecord-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - web
    restart: unless-stopped
    networks:
      - pitalrecord-network

networks:
  pitalrecord-network:
    driver: bridge
COMPOSEEOF

# Create simplified NGINX config for EC2
cat > nginx.conf << 'NGINXEOF'
events {
    worker_connections 1024;
}

http {
    upstream nextjs {
        server pitalrecord-web:3000;
    }

    server {
        listen 80;
        server_name _;

        location / {
            proxy_pass http://nextjs;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
NGINXEOF

# Configure AWS ECR credentials helper
echo "Configuring AWS credentials..."
mkdir -p ~/.aws

cat > ~/.aws/config << 'AWSCONFIG'
[default]
region = us-east-1
output = json
AWSCONFIG

echo ""
echo "Configure AWS credentials by running:"
echo "aws configure"
echo ""

# Set up automatic container restart on reboot
echo "Setting up automatic container restart..."
(crontab -l 2>/dev/null; echo "@reboot cd $APP_DIR && docker-compose up -d") | crontab -

echo ""
echo "========================================="
echo "✅ Setup Complete!"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Edit .env file: nano $APP_DIR/.env"
echo "2. Configure AWS credentials: aws configure"
echo "3. Add ECR_REGISTRY and ECR_REPOSITORY to .env"
echo "4. Login to ECR: aws ecr get-login-password --region YOUR_REGION | docker login --username AWS --password-stdin YOUR_ECR_REGISTRY"
echo "5. Run: docker-compose up -d"
echo ""
echo "Log out and log back in for Docker group changes to take effect."
echo ""

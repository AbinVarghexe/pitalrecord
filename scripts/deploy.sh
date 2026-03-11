#!/bin/bash
# =============================================================================
# Manual Deployment Script for PitalRecord
# Run from EC2 instance to pull and deploy latest image
# =============================================================================

set -e

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
ECR_REPOSITORY="${ECR_REPOSITORY:-pitalrecord}"
IMAGE_TAG="${IMAGE_TAG:-latest}"
CONTAINER_NAME="pitalrecord-web"
APP_PORT="${APP_PORT:-3000}"
HOST_PORT="${HOST_PORT:-80}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting PitalRecord deployment...${NC}"

# =============================================================================
# Get AWS Account ID and ECR registry
# =============================================================================
echo -e "${YELLOW}📋 Getting AWS account info...${NC}"
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
IMAGE_URI="${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}"

echo "Account ID: ${AWS_ACCOUNT_ID}"
echo "ECR Registry: ${ECR_REGISTRY}"
echo "Image URI: ${IMAGE_URI}"

# =============================================================================
# Login to ECR
# =============================================================================
echo -e "${YELLOW}🔐 Logging into ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}

# =============================================================================
# Pull latest image
# =============================================================================
echo -e "${YELLOW}📥 Pulling latest image...${NC}"
docker pull ${IMAGE_URI}

# =============================================================================
# Stop existing container
# =============================================================================
echo -e "${YELLOW}🛑 Stopping existing container...${NC}"
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true

# =============================================================================
# Start new container
# =============================================================================
echo -e "${YELLOW}🚀 Starting new container...${NC}"

# Load environment variables from .env file if exists
if [ -f /opt/pitalrecord/.env ]; then
    echo "Loading environment variables from /opt/pitalrecord/.env"
    export $(cat /opt/pitalrecord/.env | grep -v '^#' | xargs)
fi

docker run -d \
    --name ${CONTAINER_NAME} \
    --restart unless-stopped \
    -p ${HOST_PORT}:${APP_PORT} \
    -e NODE_ENV=production \
    -e NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}" \
    -e NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY}" \
    ${IMAGE_URI}

# =============================================================================
# Verify deployment
# =============================================================================
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
sleep 5

if docker ps | grep -q ${CONTAINER_NAME}; then
    echo -e "${GREEN}✅ Container is running!${NC}"
    echo ""
    echo "Container logs (last 10 lines):"
    docker logs --tail 10 ${CONTAINER_NAME}
    echo ""
    
    # Health check
    echo -e "${YELLOW}🏥 Running health check...${NC}"
    sleep 5
    if curl -sf http://localhost:${HOST_PORT}/health > /dev/null 2>&1 || curl -sf http://localhost:${HOST_PORT} > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Application is healthy!${NC}"
    else
        echo -e "${YELLOW}⚠️  Health check endpoint not responding yet (may still be starting)${NC}"
    fi
else
    echo -e "${RED}❌ Container failed to start${NC}"
    echo "Container logs:"
    docker logs ${CONTAINER_NAME}
    exit 1
fi

# =============================================================================
# Cleanup old images
# =============================================================================
echo -e "${YELLOW}🧹 Cleaning up old images...${NC}"
docker image prune -af --filter "until=24h" 2>/dev/null || true

echo ""
echo -e "${GREEN}=============================================="
echo "✅ Deployment completed successfully!"
echo "=============================================="
echo ""
echo "Application URL: http://$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 2>/dev/null || echo 'your-server-ip'):${HOST_PORT}"
echo "Container: ${CONTAINER_NAME}"
echo "Image: ${IMAGE_URI}${NC}"

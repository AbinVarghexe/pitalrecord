#!/usr/bin/env bash

# Idempotent EC2 deployment script used by GitHub Actions.
# Responsibilities:
# 1) Keep the server updated
# 2) Install/verify deployment requirements
# 3) Pull the latest ECR image
# 4) Deploy with Docker Compose and verify health

set -Eeuo pipefail

log() {
  printf "[deploy] %s\n" "$*"
}

install_prerequisites_ubuntu() {
  log "Updating Ubuntu packages"
  sudo apt-get update -y
  sudo DEBIAN_FRONTEND=noninteractive apt-get upgrade -y
  sudo apt-get install -y ca-certificates curl gnupg lsb-release unzip jq

  if ! command -v docker >/dev/null 2>&1; then
    log "Installing Docker Engine"
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
      sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
  fi

  if ! sudo docker compose version >/dev/null 2>&1 && ! command -v docker-compose >/dev/null 2>&1; then
    log "Installing Docker Compose"
    sudo apt-get install -y docker-compose-plugin
  fi

  if ! command -v aws >/dev/null 2>&1; then
    log "Installing AWS CLI"
    cd /tmp
    curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
    unzip -q -o awscliv2.zip
    sudo ./aws/install --update
    rm -rf /tmp/aws /tmp/awscliv2.zip
  fi
}

install_prerequisites_amazon_linux() {
  log "Updating Amazon Linux packages"
  sudo yum update -y
  sudo yum install -y docker unzip jq curl

  if ! command -v docker >/dev/null 2>&1; then
    log "Installing Docker"
    sudo yum install -y docker
  fi

  if ! sudo docker compose version >/dev/null 2>&1 && ! command -v docker-compose >/dev/null 2>&1; then
    log "Installing Docker Compose"
    sudo curl -fsSL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
  fi

  if ! command -v aws >/dev/null 2>&1; then
    log "Installing AWS CLI"
    cd /tmp
    curl -fsSL "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o awscliv2.zip
    unzip -q -o awscliv2.zip
    sudo ./aws/install --update
    rm -rf /tmp/aws /tmp/awscliv2.zip
  fi
}

compose() {
  if sudo docker compose version >/dev/null 2>&1; then
    sudo docker compose "$@"
  else
    sudo docker-compose "$@"
  fi
}

main() {
  : "${AWS_REGION:?AWS_REGION is required}"
  : "${ECR_REGISTRY:?ECR_REGISTRY is required}"
  : "${ECR_REPOSITORY:?ECR_REPOSITORY is required}"

  APP_DIR="${APP_DIR:-$HOME/pitalrecord}"
  IMAGE_TAG="${IMAGE_TAG:-latest}"
  IMAGE_URI="${ECR_REGISTRY}/${ECR_REPOSITORY}:${IMAGE_TAG}"

  NEXT_PUBLIC_SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL:-}"
  NEXT_PUBLIC_SUPABASE_ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-}"

  if command -v apt-get >/dev/null 2>&1; then
    install_prerequisites_ubuntu
  elif command -v yum >/dev/null 2>&1; then
    install_prerequisites_amazon_linux
  else
    log "Unsupported Linux distribution: apt-get/yum not found"
    exit 1
  fi

  sudo systemctl enable docker
  sudo systemctl start docker

  mkdir -p "$APP_DIR"

  if [ ! -f "$APP_DIR/docker-compose.yml" ]; then
    log "Missing $APP_DIR/docker-compose.yml"
    exit 1
  fi

  if [ ! -f "$APP_DIR/nginx.conf" ]; then
    log "Missing $APP_DIR/nginx.conf"
    exit 1
  fi

  cat > "$APP_DIR/.env.production" <<EOF
IMAGE_URI=$IMAGE_URI
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
EOF

  log "Authenticating to ECR"
  aws configure set default.region "$AWS_REGION"
  aws ecr get-login-password --region "$AWS_REGION" | sudo docker login --username AWS --password-stdin "$ECR_REGISTRY"

  cd "$APP_DIR"

  log "Pulling and deploying containers"
  compose --env-file .env.production pull
  compose --env-file .env.production down --remove-orphans || true
  compose --env-file .env.production up -d --force-recreate

  log "Waiting for service health"
  for _ in $(seq 1 30); do
    if curl -fsS http://localhost/ >/dev/null 2>&1 || curl -fsS http://localhost:3000/ >/dev/null 2>&1; then
      log "Deployment healthy"
      compose ps
      sudo docker image prune -af --filter "until=72h" || true
      exit 0
    fi
    sleep 5
  done

  log "Deployment health check failed"
  compose ps || true
  compose logs --tail=200 || true
  exit 1
}

main "$@"

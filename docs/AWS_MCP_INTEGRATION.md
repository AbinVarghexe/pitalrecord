# AWS MCP Server Integration Guide

## Overview

This guide explains how to integrate AWS MCP (Model Context Protocol) servers into your development workflow for the Pitalrecord project. AWS MCP servers enable AI assistants like Claude Desktop, Cline, Cursor, and VS Code to interact directly with AWS services.

## What is AWS MCP?

AWS MCP servers are specialized Model Context Protocol implementations that provide:
- ✅ Direct access to AWS services through AI assistants
- ✅ Up-to-date AWS documentation and API references
- ✅ Infrastructure as Code (CloudFormation, CDK) support
- ✅ Serverless application management
- ✅ Security best practices and compliance validation

## Available AWS MCP Servers

### Recommended for This Project

#### 1. **AWS API MCP Server** (Primary)
Start here for general AWS interactions with comprehensive API support.

**Use Cases:**
- Managing EC2 instances
- Configuring ECR repositories
- IAM permissions management
- Resource exploration and status checking

**Installation:**
```bash
uv tool install awslabs.aws-api-mcp-server
```

#### 2. **AWS IaC MCP Server** (Infrastructure as Code)
Complete Infrastructure as Code toolkit with CloudFormation and CDK support.

**Use Cases:**
- Generate CloudFormation templates
- Create CDK stacks for your Next.js app
- Security validation of infrastructure
- Deployment troubleshooting

**Installation:**
```bash
uv tool install awslabs.iac-mcp-server
```

#### 3. **AWS Serverless MCP Server** (Optional)
SAM CLI integration for serverless applications.

**Use Cases:**
- Lambda function management
- API Gateway configuration
- Serverless deployment workflows

**Installation:**
```bash
uv tool install awslabs.serverless-mcp-server
```

#### 4. **AWS ECR MCP Server** (Optional)
Specialized ECR (Elastic Container Registry) management.

**Use Cases:**
- Container image management
- Repository lifecycle policies
- Image scanning and security

**Installation:**
```bash
uv tool install awslabs.ecr-mcp-server
```

## Prerequisites

### 1. Install UV Package Manager

**macOS/Linux:**
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

**Windows (PowerShell):**
```powershell
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### 2. Install Python 3.10+

```bash
uv python install 3.10
```

### 3. Configure AWS Credentials

Ensure your AWS credentials are configured with appropriate permissions:

```bash
aws configure
```

**Required IAM Permissions:**
- EC2: Full access for instance management
- ECR: Full access for container registry
- IAM: ReadOnly (for security validation)
- CloudFormation/CDK: Full access (if using IaC MCP)

## Configuration for AI Assistants

### Claude Desktop

**Location:**
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`

**Configuration:**
```json
{
  "mcpServers": {
    "aws-api": {
      "command": "uvx",
      "args": ["awslabs.aws-api-mcp-server@latest"],
      "env": {
        "AWS_REGION": "us-east-1",
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    },
    "aws-iac": {
      "command": "uvx",
      "args": ["awslabs.iac-mcp-server@latest"],
      "env": {
        "AWS_REGION": "us-east-1",
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    }
  }
}
```

### Cline (VS Code Extension)

**Location:** `.vscode/mcp_config.json` or `cline_mcp_settings.json`

**Configuration:**
```json
{
  "mcpServers": {
    "aws-api": {
      "command": "uvx",
      "args": ["awslabs.aws-api-mcp-server@latest"],
      "env": {
        "AWS_REGION": "us-east-1",
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    },
    "aws-iac": {
      "command": "uvx",
      "args": ["awslabs.iac-mcp-server@latest"],
      "env": {
        "AWS_REGION": "us-east-1",
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    }
  }
}
```

### Cursor

**Location:** `.cursor/mcp.json`

**Configuration:**
```json
{
  "mcpServers": {
    "aws-api": {
      "command": "uvx",
      "args": ["awslabs.aws-api-mcp-server@latest"],
      "env": {
        "AWS_REGION": "us-east-1",
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    },
    "aws-iac": {
      "command": "uvx",
      "args": ["awslabs.iac-mcp-server@latest"],
      "env": {
        "AWS_REGION": "us-east-1",
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    }
  }
}
```

### VS Code Copilot

**Location:** `.vscode/mcp.json`

**Configuration:**
```json
{
  "mcpServers": {
    "aws-api": {
      "command": "uvx",
      "args": ["awslabs.aws-api-mcp-server@latest"],
      "env": {
        "AWS_REGION": "us-east-1",
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    },
    "aws-iac": {
      "command": "uvx",
      "args": ["awslabs.iac-mcp-server@latest"],
      "env": {
        "AWS_REGION": "us-east-1",
        "FASTMCP_LOG_LEVEL": "ERROR"
      }
    }
  }
}
```

## Common Use Cases

### 1. Create EC2 Instance for Deployment

**Prompt to AI Assistant:**
```
Using the AWS MCP server, create a t3.small EC2 instance in us-east-1 
for deploying the pitalrecord Next.js application. Configure:
- Ubuntu 24.04 LTS AMI
- Security group allowing ports 80, 443, 22, 3000
- 30GB gp3 root volume
- Add tags: Project=pitalrecord, Environment=production
```

### 2. Set Up ECR Repository

**Prompt to AI Assistant:**
```
Using AWS MCP, create an ECR repository named 'pitalrecord-web' with:
- Image scanning on push enabled
- Encryption at rest
- Lifecycle policy: keep last 10 images
- Tag immutability enabled
```

### 3. Generate CloudFormation Template

**Prompt to AI Assistant:**
```
Using AWS IaC MCP server, generate a CloudFormation template for:
- VPC with public/private subnets
- EC2 instance (t3.small)
- Application Load Balancer
- ECR repository
- RDS PostgreSQL database (if needed for future)
Include security groups and IAM roles following best practices.
```

### 4. Validate GitHub Actions Workflow

**Prompt to AI Assistant:**
```
Review my GitHub Actions workflow in .github/workflows/deploy.yml
using AWS MCP server. Validate:
- IAM permissions required
- ECR authentication steps
- EC2 deployment configuration
- Security best practices
Suggest improvements.
```

### 5. Estimate Infrastructure Costs

**Prompt to AI Assistant:**
```
Using AWS MCP, estimate monthly costs for:
- EC2 t3.small instance (24/7)
- 100GB ECR storage
- 1TB data transfer
- Application Load Balancer
```

## Troubleshooting

### Issue: "Command not found: uvx"

**Solution:**
```bash
# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc

# Verify installation
uv --version
```

### Issue: AWS Credentials Not Found

**Solution:**
```bash
# Set environment variables
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_REGION="us-east-1"

# Or configure AWS CLI
aws configure
```

### Issue: MCP Server Not Responding

**Solution:**
```bash
# Test server manually
timeout 15s uvx awslabs.aws-api-mcp-server 2>&1 || echo "Timeout"

# Check logs
export FASTMCP_LOG_LEVEL="DEBUG"

# Clear UV cache
uv cache clean awslabs.aws-api-mcp-server
```

### Issue: Permission Denied Errors

**Solution:**
Ensure your IAM user/role has the necessary permissions. Example policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:*",
        "ecr:*",
        "iam:Get*",
        "iam:List*",
        "cloudformation:*",
        "s3:*"
      ],
      "Resource": "*"
    }
  ]
}
```

## Advanced Configuration

### Multiple AWS Profiles

```json
{
  "mcpServers": {
    "aws-api-dev": {
      "command": "uvx",
      "args": ["awslabs.aws-api-mcp-server@latest"],
      "env": {
        "AWS_PROFILE": "dev",
        "AWS_REGION": "us-east-1"
      }
    },
    "aws-api-prod": {
      "command": "uvx",
      "args": ["awslabs.aws-api-mcp-server@latest"],
      "env": {
        "AWS_PROFILE": "production",
        "AWS_REGION": "us-east-1"
      }
    }
  }
}
```

### Using Docker for MCP Servers

```json
{
  "mcpServers": {
    "aws-api-docker": {
      "command": "docker",
      "args": [
        "run", "--rm", "--interactive",
        "--env", "AWS_REGION=us-east-1",
        "--volume", "${HOME}/.aws:/app/.aws",
        "public.ecr.aws/awslabs-mcp/awslabs/aws-api-mcp-server:latest"
      ]
    }
  }
}
```

## Security Best Practices

### 1. Use IAM Roles with Least Privilege

Create specific IAM policies for your deployment workflow:

```bash
# Example: Create deployment-specific IAM user
aws iam create-user --user-name pitalrecord-deployer

# Attach minimal required policies
aws iam attach-user-policy \
  --user-name pitalrecord-deployer \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser
```

### 2. Enable CloudTrail Logging

All AWS MCP server actions are logged via CloudTrail for auditability.

### 3. Use Environment-Specific Credentials

Never commit AWS credentials. Use environment variables or AWS profiles.

### 4. Rotate Access Keys Regularly

```bash
# Create new access key
aws iam create-access-key --user-name pitalrecord-deployer

# Delete old access key after updating
aws iam delete-access-key --user-name pitalrecord-deployer --access-key-id OLD_KEY_ID
```

## Integration with GitHub Actions

The AWS MCP servers complement your existing GitHub Actions workflow but don't replace it:

- **GitHub Actions**: Automated CI/CD on every push (production)
- **AWS MCP**: Interactive development and troubleshooting (development)

Example workflow:
1. Use AWS MCP locally to prototype infrastructure
2. Generate CloudFormation/CDK code
3. Test deployment with AWS MCP
4. Commit code, let GitHub Actions handle production deployment

## Resources

- [AWS MCP Servers GitHub Repository](https://github.com/awslabs/mcp)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [AWS MCP Server Full List](https://awslabs.github.io/mcp/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

## Next Steps

1. Install UV and Python (see Prerequisites)
2. Configure AWS credentials
3. Choose your AI assistant (Claude Desktop, Cline, Cursor, VS Code)
4. Add MCP server configuration
5. Restart your AI assistant
6. Test with simple prompts like "List my EC2 instances using AWS MCP"
7. Start using advanced features for deployment automation

## Support

For issues with AWS MCP servers:
- GitHub Issues: https://github.com/awslabs/mcp/issues
- AWS Support: Your existing AWS support channel

For project-specific issues:
- Project repository issues
- Team Slack/communication channel

# MCP Configuration Examples

This directory contains example MCP configurations for different AI assistants. These configurations enable your AI to interact with AWS services using the AWS MCP servers.

## 📁 Available Configurations

### `.vscode/mcp.json`
Configuration for VS Code Copilot. This file enables AWS MCP server integration with VS Code's AI features.

**Location for manual setup:**
- Copy to your workspace `.vscode/` directory
- Restart VS Code after adding

### `.cursor/mcp.json`
Configuration for Cursor AI editor. Enables AWS operations through Cursor's AI assistant.

**Location for manual setup:**
- Copy to your workspace `.cursor/` directory
- Restart Cursor after adding

### `cline_mcp_settings.json` (example)
Configuration for Cline VS Code extension. Allows Cline to execute AWS operations.

**Location for manual setup:**
- Place in project root or `.vscode/`
- Cline will auto-detect on startup

### `claude_desktop_config.json` (example)
Configuration for Claude Desktop application.

**Manual setup locations:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
- **Linux**: `~/.config/Claude/claude_desktop_config.json`

## 🚀 Quick Setup

### Prerequisites

1. **Install UV package manager:**
   ```bash
   # macOS/Linux
   curl -LsSf https://astral.sh/uv/install.sh | sh
   
   # Windows (PowerShell)
   powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
   ```

2. **Install Python 3.10+:**
   ```bash
   uv python install 3.10
   ```

3. **Configure AWS credentials:**
   ```bash
   aws configure
   ```
   Or set environment variables:
   ```bash
   export AWS_ACCESS_KEY_ID="your-key-id"
   export AWS_SECRET_ACCESS_KEY="your-secret-key"
   export AWS_REGION="us-east-1"
   ```

### Installation Steps

1. **Copy the appropriate configuration file:**
   ```bash
   # For VS Code
   cp examples/.vscode/mcp.json .vscode/mcp.json
   
   # For Cursor
   cp examples/.cursor/mcp.json .cursor/mcp.json
   ```

2. **Install AWS MCP servers:**
   ```bash
   # AWS API Server (Primary)
   uv tool install awslabs.aws-api-mcp-server
   
   # AWS IaC Server (CloudFormation/CDK)
   uv tool install awslabs.iac-mcp-server
   
   # AWS Documentation Server
   uv tool install awslabs.documentation-mcp-server
   ```

3. **Restart your AI assistant**

4. **Test the connection:**
   Ask your AI: "Using AWS MCP, list my EC2 instances in us-east-1"

## 🔧 Configured MCP Servers

### 1. AWS API MCP Server
**Purpose:** Comprehensive AWS API access for all services

**Capabilities:**
- EC2 instance management
- ECR repository operations
- IAM permissions checking
- Resource exploration
- Security group configuration

**Example Prompts:**
- "Create an EC2 t3.small instance for my app"
- "List all ECR repositories"
- "Show security groups for my VPC"

### 2. AWS IaC MCP Server
**Purpose:** Infrastructure as Code generation and management

**Capabilities:**
- CloudFormation template generation
- CDK stack creation
- Security validation
- Best practices enforcement
- Deployment troubleshooting

**Example Prompts:**
- "Generate a CloudFormation template for an ALB"
- "Create a CDK stack for this Next.js application"
- "Validate my infrastructure for security best practices"

### 3. AWS Documentation MCP Server
**Purpose:** Access to latest AWS documentation and API references

**Capabilities:**
- Service documentation lookup
- API reference retrieval
- Best practices guidance
- Example code snippets

**Example Prompts:**
- "Show me the latest EC2 API documentation"
- "What are CDK best practices for Next.js apps?"
- "Find examples of ECR lifecycle policies"

## 🎯 Use Cases for This Project

### 1. EC2 Instance Setup
```
Using AWS MCP, create a t3.small EC2 instance in us-east-1 for deploying 
the pitalrecord Next.js application. Configure:
- Ubuntu 24.04 LTS
- Security group: ports 80, 443, 22, 3000
- 30GB gp3 volume
- Tags: Project=pitalrecord, Environment=production
```

### 2. ECR Repository Configuration
```
Using AWS MCP, set up an ECR repository named 'pitalrecord-web' with:
- Image scanning on push
- Encryption enabled
- Lifecycle policy: keep last 10 images
- Tag immutability
```

### 3. Infrastructure as Code
```
Using AWS IaC MCP, generate CloudFormation for:
- VPC with public/private subnets
- Application Load Balancer
- EC2 instance with Docker
- ECR repository
Include all security best practices.
```

### 4. Cost Estimation
```
Using AWS MCP, estimate monthly costs for:
- EC2 t3.small (24/7)
- 100GB ECR storage
- 1TB data transfer
- ALB with 1M requests
```

### 5. Deployment Troubleshooting
```
My GitHub Actions workflow is failing during ECR push. 
Use AWS MCP to:
1. Check ECR repository exists
2. Verify IAM permissions for GitHub Actions user
3. Test authentication
4. Suggest fixes
```

## 🔒 Security Considerations

### AWS Credentials
- **Never commit AWS credentials to git**
- Use AWS IAM roles when possible
- Rotate access keys regularly
- Use least privilege principle

### Configuration Files
These MCP configuration files don't contain credentials. They only specify:
- Which MCP servers to use
- AWS region
- Log levels

Actual credentials are read from:
- `~/.aws/credentials` (AWS CLI config)
- Environment variables
- IAM roles (when running on AWS)

### Recommended IAM Policy
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ec2:Describe*",
        "ec2:RunInstances",
        "ec2:TerminateInstances",
        "ecr:*",
        "iam:Get*",
        "iam:List*"
      ],
      "Resource": "*"
    }
  ]
}
```

## 🐛 Troubleshooting

### UVX Command Not Found
```bash
# Reload shell
source ~/.bashrc  # or ~/.zshrc

# Verify installation
uv --version
```

### AWS Credentials Error
```bash
# Verify AWS configuration
aws sts get-caller-identity

# Check environment variables
echo $AWS_ACCESS_KEY_ID
echo $AWS_REGION
```

### MCP Server Not Loading
```bash
# Test server manually
timeout 15s uvx awslabs.aws-api-mcp-server 2>&1

# Clear cache and reinstall
uv cache clean awslabs.aws-api-mcp-server
uv tool install awslabs.aws-api-mcp-server
```

### Enable Debug Logging
Edit your MCP configuration, change:
```json
"FASTMCP_LOG_LEVEL": "ERROR"
```
to:
```json
"FASTMCP_LOG_LEVEL": "DEBUG"
```

## 📚 Additional Resources

- [AWS MCP Integration Guide](../docs/AWS_MCP_INTEGRATION.md)
- [AWS MCP Servers Repository](https://github.com/awslabs/mcp)
- [Model Context Protocol Docs](https://modelcontextprotocol.io/)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)

## 🆘 Getting Help

1. **Check the logs** - Enable DEBUG logging
2. **Test manually** - Run MCP servers with `uvx` in terminal
3. **Verify credentials** - Use `aws sts get-caller-identity`
4. **GitHub Issues** - https://github.com/awslabs/mcp/issues
5. **Project Issues** - Open an issue in this repository

## 🔄 Updating MCP Servers

### Automatic Updates (using @latest)
The configurations use `@latest` suffix, which checks for updates on each launch. This increases startup time but ensures latest features.

### Manual Updates
```bash
# Update specific server
uv tool install --upgrade awslabs.aws-api-mcp-server

# Update all UV tools
uv tool upgrade --all
```

### Lock to Specific Version
If you prefer stability over latest features:
```json
"args": ["awslabs.aws-api-mcp-server==1.2.3"]
```

Check latest versions: https://pypi.org/search/?q=awslabs

## 📝 Notes

- MCP servers run locally on your machine
- They use your AWS credentials (same as AWS CLI)
- All AWS API calls are auditable via CloudTrail
- Servers auto-start when AI assistant launches
- No data is sent to third parties
- Servers can be enabled/disabled per assistant

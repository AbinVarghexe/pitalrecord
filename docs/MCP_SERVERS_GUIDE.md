# MCP Servers for AWS and GitHub Integration

## What are MCP Servers?

Model Context Protocol (MCP) servers provide standardized interfaces for AI assistants to interact with external services like AWS and GitHub.

## Available MCP Servers for This Project

### 1. GitHub MCP Server

**Purpose:** Automate GitHub operations (commits, pull requests, issues, etc.)

**Official Documentation:**
- Repository: https://github.com/modelcontextprotocol/servers
- GitHub MCP: https://github.com/modelcontextprotocol/servers/tree/main/src/github

**Available Tools (built-in to VS Code):**
The GitHub MCP server is already integrated in VS Code Copilot. Available tools include:
- `mcp_io_github_git_create_or_update_file` - Create/update files
- `mcp_io_github_git_create_pull_request` - Create PRs
- `mcp_io_github_git_push_files` - Push changes
- `mcp_io_github_git_issue_read` - Read issues
- `mcp_io_github_git_search_code` - Search code
- And many more...

**Authentication:**
GitHub MCP uses your existing GitHub authentication in VS Code.

**No additional setup required** - Already available in your environment!

### 2. AWS MCP Server (Third-party)

**Note:** There is currently no official AWS MCP server maintained by Anthropic/ModelContextProtocol.

**Alternative Options:**

#### Option A: AWS CLI + Shell Commands (Current Approach)
- Most reliable and well-documented
- Uses standard AWS CLI
- Integrated in our GitHub Actions workflow
- **Recommended for this project**

#### Option B: Community AWS MCP Servers
Several community projects exist:
- https://github.com/rishikavikondala/mcp-server-aws (Community project)
- https://github.com/angheljf/aws-mcp-server (Community project)

⚠️ **Warning:** These are not official and may have limited support.

## Our Implementation

For this project, we're using:

### ✅ GitHub Actions (Instead of GitHub MCP)
- Automated CI/CD pipeline
- Triggered on push to main/master branch
- No manual intervention needed
- More reliable for deployment automation

### ✅ AWS CLI in GitHub Actions (Instead of AWS MCP)
- Standard AWS tooling
- Well-documented and supported
- Integrated in deployment workflow
- Uses AWS credentials securely via GitHub Secrets

## Setting Up Credentials

### For GitHub Actions (Automated Deployment)

1. **GitHub Personal Access Token** (if needed for advanced operations):
   - Go to https://github.com/settings/tokens
   - Generate new token (classic)
   - Select scopes: `repo`, `workflow`, `write:packages`
   - Save token securely

2. **AWS Credentials:**
   - Create IAM user: `github-actions-deploy`
   - Attach policies:
     - `AmazonEC2ContainerRegistryFullAccess`
     - `AmazonEC2ReadOnlyAccess`
   - Generate access key
   - Save:
     - Access Key ID
     - Secret Access Key

3. **Add to GitHub Secrets:**
   - Go to Repository → Settings → Secrets and variables → Actions
   - Add all required secrets (see DEPLOYMENT_CHECKLIST.md)

## MCP Server Links Reference

### Official MCP Resources
- **Main Repository:** https://github.com/modelcontextprotocol/servers
- **Specification:** https://spec.modelcontextprotocol.io
- **Documentation:** https://modelcontextprotocol.io

### GitHub MCP
- **Source:** https://github.com/modelcontextprotocol/servers/tree/main/src/github
- **Documentation:** Built into VS Code Copilot

### Supabase MCP (Bonus!)
Since you're using Supabase, there's an official Supabase MCP:
- **Source:** https://github.com/modelcontextprotocol/servers/tree/main/src/supabase
- **Tools:** Database operations, migrations, edge functions, etc.

To use Supabase MCP tools, search for them first:
```
Use tool_search_tool_regex with pattern: mcp_com_supabase
```

## Why We're Not Using MCP Servers for Deployment

**Reasons:**
1. **GitHub Actions is more robust** for CI/CD
2. **Better logging and debugging** with Actions
3. **Industry standard** for automated deployments
4. **Better error handling** and retry mechanisms
5. **More secure** credential management
6. **No dependency on AI assistant** being online

**MCP is great for:**
- Interactive development tasks
- Ad-hoc operations
- Exploration and debugging
- Quick fixes and updates

**GitHub Actions is better for:**
- Automated deployments (our use case)
- Scheduled tasks
- Complex workflows
- Production reliability

## Using MCP Tools (If Needed)

If you want to use MCP tools for GitHub operations during development:

```typescript
// Example: Search for GitHub MCP tools
tool_search_tool_regex pattern: "mcp_io_github_git"

// Example: Use a tool
mcp_io_github_git_create_or_update_file({
  owner: "YourUsername",
  repo: "pitalrecord",
  path: "README.md",
  content: "Updated content",
  message: "Update README"
})
```

## Summary

For this project:
- ✅ **Using:** GitHub Actions for automated deployment
- ✅ **Using:** AWS CLI integrated in workflow
- ✅ **Using:** Docker for containerization
- ✅ **Using:** NGINX for reverse proxy
- ❌ **Not using:** MCP servers for deployment (but available for dev tasks)

This approach provides:
- Maximum reliability
- Best practices for production
- Easy debugging and monitoring
- Standard industry tools

---

**For deployment instructions, see:** [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md)

**For credentials checklist, see:** [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

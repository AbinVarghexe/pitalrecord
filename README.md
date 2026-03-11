# PitalRecord

A Next.js monorepo application for patient record management, built with modern web technologies and deployed to AWS.

## 📚 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Deployment](#deployment)
- [AWS MCP Integration](#aws-mcp-integration)
- [Available Scripts](#available-scripts)
- [Documentation](#documentation)

## 🎯 Overview

PitalRecord is a modern web application for managing patient records, built with:
- ⚡ Next.js 16 with React 19
- 🎨 Tailwind CSS + shadcn/ui components
- 🔐 Supabase authentication
- 📦 Turborepo monorepo structure
- 🐳 Docker containerization
- ☁️ AWS EC2 deployment
- 🔄 Automated CI/CD with GitHub Actions

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 16.1.6 (React 19.2.4)
- **Styling:** Tailwind CSS, shadcn/ui
- **State Management:** React Hooks
- **Theme:** next-themes (dark mode support)

### Backend
- **Authentication:** Supabase Auth
- **Database:** Supabase (PostgreSQL)
- **API:** Next.js API Routes

### Infrastructure
- **Containerization:** Docker multi-stage builds
- **Web Server:** NGINX reverse proxy
- **Hosting:** AWS EC2
- **Container Registry:** AWS ECR
- **CI/CD:** GitHub Actions

### Development Tools
- **Package Manager:** pnpm 9.0.6
- **Build System:** Turborepo
- **Node Version:** >=20
- **TypeScript:** Full type safety

## 📁 Project Structure

```
pitalrecord/
├── apps/
│   └── web/                    # Main Next.js application
│       ├── app/               # Next.js App Router
│       ├── components/        # React components
│       ├── lib/              # Utilities and configs
│       └── middleware.ts     # Auth middleware
├── packages/
│   ├── ui/                   # Shared UI components (shadcn/ui)
│   ├── eslint-config/       # ESLint configurations
│   └── typescript-config/   # TypeScript configurations
├── docs/                     # Documentation
├── .github/workflows/       # GitHub Actions CI/CD
├── nginx/                   # NGINX configuration
├── scripts/                 # Deployment scripts
├── Dockerfile              # Multi-stage Docker build
├── docker-compose.yml      # Local Docker setup
└── turbo.json             # Turborepo configuration
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 9.0.6
- Docker (for containerization)
- Supabase account
- AWS account (for deployment)

### Quick Setup (Automated) ⚡

We provide an **interactive setup wizard** that automatically collects all credentials and configures everything for you!

**Windows:**
```powershell
.\scripts\setup-credentials.ps1
```

**Linux/macOS:**
```bash
chmod +x ./scripts/setup-credentials.sh
./scripts/setup-credentials.sh
```

The wizard will:
- ✅ Prompt for all 9 required credentials
- ✅ Create `.env` files automatically
- ✅ Add GitHub secrets (if GitHub CLI installed)
- ✅ Validate and confirm your configuration

📖 **[See Complete Setup Guide →](./SETUP.md)**

### Manual Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd pitalrecord
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start development server:**
   ```bash
   pnpm dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:3000`

## 💻 Development

### Adding UI Components

To add shadcn/ui components to your app:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Components are stored in `packages/ui/src/components/` for reuse across the monorepo.

### Using Components

Import components from the `ui` package:

```tsx
import { Button } from "@workspace/ui/components/button";

export default function Page() {
  return <Button>Click me</Button>;
}
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Linting and Formatting

```bash
# Lint all packages
pnpm lint

# Format code
pnpm format
```

## 🐳 Deployment

### Quick Start: Automated Credentials Setup ⚡

Before deploying, run the automated setup wizard to configure all credentials:

```powershell
# Windows
.\scripts\setup-credentials.ps1

# Linux/macOS
./scripts/setup-credentials.sh
```

This will automatically:
- Collect all 9 required AWS and Supabase credentials
- Create `.env` files
- Add GitHub repository secrets
- Validate your configuration

📖 **[Complete Setup Guide →](./SETUP.md)**

### Local Docker Testing

1. **Build and run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

2. **Access the application:**
   - App: http://localhost:3000
   - NGINX: http://localhost:80

### AWS EC2 Deployment

The project includes automated deployment to AWS EC2 using GitHub Actions.

**Prerequisites:**
- AWS account with IAM user
- EC2 instance (t3.small or larger)
- ECR repository
- GitHub repository with required secrets

**Quick Deploy:**
1. Run setup wizard: `.\scripts\setup-credentials.ps1`
2. Setup EC2: SSH and run `./scripts/setup-ec2.sh`
3. Deploy: `git push origin master`

**Detailed deployment guide:** See [AWS Deployment Guide](./docs/AWS_DEPLOYMENT_GUIDE.md)

### Automated CI/CD

On every push to `main`, `master`, or `develop` branches:
1. ✅ Code is built and tested
2. ✅ Docker image is created
3. ✅ Image is pushed to AWS ECR
4. ✅ EC2 instance pulls and deploys new version
5. ✅ Health check verifies deployment

**GitHub Actions workflow:** `.github/workflows/deploy.yml`

## 🤖 AWS MCP Integration

Enhance your development workflow with AWS MCP (Model Context Protocol) servers. This enables AI assistants like Claude Desktop, Cline, Cursor, and VS Code Copilot to interact directly with AWS services.

### What is AWS MCP?

AWS MCP servers allow you to:
- 🚀 Create and manage AWS resources using natural language
- 🏗️ Generate Infrastructure as Code (CloudFormation/CDK)
- 💰 Estimate infrastructure costs
- 🔍 Validate deployment configurations
- 🛡️ Check security best practices

### Quick Setup

1. **Install prerequisites:**
   ```bash
   # Install UV package manager
   curl -LsSf https://astral.sh/uv/install.sh | sh
   
   # Install Python
   uv python install 3.10
   ```

2. **Install AWS MCP servers:**
   ```bash
   # AWS API Server (primary)
   uv tool install awslabs.aws-api-mcp-server
   
   # AWS IaC Server (CloudFormation/CDK)
   uv tool install awslabs.iac-mcp-server
   ```

3. **Configure your AI assistant:**
   - Copy `.vscode/mcp.json` (for VS Code)
   - Copy `.cursor/mcp.json` (for Cursor)
   - Or follow the [AWS MCP Integration Guide](./docs/AWS_MCP_INTEGRATION.md)

4. **Start using AI commands:**
   ```
   "Using AWS MCP, create a t3.small EC2 instance for my Next.js app"
   "Generate a CloudFormation template for this infrastructure"
   "Estimate the monthly cost of this deployment"
   ```

### Documentation

- 📖 [AWS MCP Integration Guide](./docs/AWS_MCP_INTEGRATION.md) - Complete setup and usage
- 📝 [MCP Setup README](./docs/MCP_SETUP_README.md) - Configuration examples
- 🎯 [Use cases and examples](./docs/AWS_MCP_INTEGRATION.md#common-use-cases)

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run tests |
| `pnpm clean` | Clean build artifacts |

## 📚 Documentation

### Quick Start
- 🚀 **[Automated Setup Guide](./SETUP.md)** - Interactive credential setup wizard (START HERE!)
- � [Credentials Guide](./docs/CREDENTIALS_GUIDE.md) - Complete credential reference with diagrams
- �📋 [Deployment Checklist](./docs/DEPLOYMENT_CHECKLIST.md) - Manual credential collection

### Deployment Guides
- [AWS Deployment Guide](./docs/AWS_DEPLOYMENT_GUIDE.md) - Complete AWS deployment walkthrough
- [Command Reference](./docs/COMMAND_REFERENCE.md) - Quick command lookup

### AI-Powered Development
- [AWS MCP Integration](./docs/AWS_MCP_INTEGRATION.md) - AI-powered AWS management
- [MCP Setup Guide](./docs/MCP_SETUP_README.md) - MCP configuration examples
- [MCP Servers Guide](./docs/MCP_SERVERS_GUIDE.md) - Understanding MCP architecture

### Authentication
- [Supabase Setup](./apps/web/SUPABASE_SETUP.md) - Authentication configuration
- [Auth Guide](./apps/web/AUTH_GUIDE.md) - Authentication implementation

## 🔐 Security

- ✅ Environment variables for sensitive data
- ✅ Supabase Row Level Security (RLS)
- ✅ NGINX security headers
- ✅ Rate limiting enabled
- ✅ HTTPS ready (with SSL configuration)
- ✅ Non-root Docker user
- ✅ IAM-based AWS permissions

**Never commit:**
- `.env` files
- AWS credentials
- Supabase keys
- Private API keys

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

[Add your license here]

## 🆘 Support

For issues and questions:
- 📧 Open an issue in the repository
- 💬 Contact the development team
- 📖 Check the documentation in `/docs`

## 🎉 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautiful UI components
- [Supabase](https://supabase.com/) - Backend as a Service
- [Turborepo](https://turbo.build/) - Monorepo build system
- [AWS MCP Servers](https://github.com/awslabs/mcp) - AI-powered AWS integration

---

**Built with ❤️ using Next.js, React, and modern web technologies**

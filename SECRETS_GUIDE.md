# GitHub Secrets Configuration Guide

This guide explains how to obtain all required secrets for the CI/CD pipeline deployment.

---

## 📋 Required Secrets Overview

| Secret Name | Source | Description |
|-------------|--------|-------------|
| `AWS_ACCESS_KEY_ID` | AWS IAM | Access key for AWS authentication |
| `AWS_SECRET_ACCESS_KEY` | AWS IAM | Secret key for AWS authentication |
| `EC2_HOST` | AWS EC2 | Public IP or DNS of your EC2 instance |
| `EC2_USER` | AWS EC2 | SSH username (ec2-user, ubuntu, etc.) |
| `EC2_SSH_PRIVATE_KEY` | AWS EC2 | Private key (.pem) for SSH access |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Public anon key for Supabase |

---

## 🔐 AWS Credentials

### Step 1: Create IAM User

1. Go to **AWS Console** → **IAM** → **Users**
   - URL: https://console.aws.amazon.com/iam/home#/users

2. Click **Create user**
   - Username: `github-actions-deployer`
   - Check **Provide user access to the AWS Management Console** (optional)

3. Click **Next** → **Attach policies directly**

4. Attach these policies:
   - `AmazonEC2ContainerRegistryFullAccess` (for ECR)
   - `AmazonEC2ReadOnlyAccess` (for EC2 info)
   - Or create a custom policy (see below)

5. Click **Create user**

### Step 2: Generate Access Keys

1. Click on the newly created user
2. Go to **Security credentials** tab
3. Under **Access keys**, click **Create access key**
4. Select **Command Line Interface (CLI)**
5. Click **Create access key**
6. **Copy and save both values:**
   ```
   AWS_ACCESS_KEY_ID: AKIAXXXXXXXXXXXXXXXX
   AWS_SECRET_ACCESS_KEY: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```
   ⚠️ **Warning:** The secret key is only shown once!

### Custom IAM Policy (Recommended)

For minimal permissions, create a custom policy:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:PutImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:DescribeRepositories",
                "ecr:CreateRepository",
                "ecr:ListImages"
            ],
            "Resource": "*"
        }
    ]
}
```

---

## 🖥️ EC2 Instance Details

### EC2_HOST (Public IP Address)

1. Go to **AWS Console** → **EC2** → **Instances**
   - URL: https://console.aws.amazon.com/ec2/home#Instances

2. Select your instance

3. Copy the **Public IPv4 address** or **Public IPv4 DNS**
   ```
   EC2_HOST: 54.123.45.67
   # or
   EC2_HOST: ec2-54-123-45-67.compute-1.amazonaws.com
   ```

### EC2_USER (SSH Username)

The username depends on your AMI:

| AMI Type | Username |
|----------|----------|
| Amazon Linux 2/2023 | `ec2-user` |
| Ubuntu | `ubuntu` |
| Debian | `admin` |
| RHEL | `ec2-user` or `root` |
| CentOS | `centos` or `ec2-user` |
| Fedora | `fedora` or `ec2-user` |

```
EC2_USER: ec2-user
```

### EC2_SSH_PRIVATE_KEY (PEM File)

#### Option A: Use Existing Key Pair

1. Locate your `.pem` file downloaded when you created the EC2 instance
2. The file content should look like:

```
-----BEGIN RSA PRIVATE KEY-----
MIIEpQIBAAKCAQEA0Z3VS5JJcds...
[many lines of base64 encoded data]
...xxxxxxxxxxxxxxxxxxxxxxxx==
-----END RSA PRIVATE KEY-----
```

Or for newer OpenSSH format:
```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5v...
[many lines of base64 encoded data]
...xxxxxxxxxxxxxxxxxxxxxxxx==
-----END OPENSSH PRIVATE KEY-----
```

#### Option B: Create New Key Pair

1. Go to **AWS Console** → **EC2** → **Key Pairs**
   - URL: https://console.aws.amazon.com/ec2/home#KeyPairs

2. Click **Create key pair**
   - Name: `pitalrecord-deploy`
   - Key pair type: **RSA**
   - Private key file format: **.pem**

3. Click **Create key pair** (downloads automatically)

4. Add the public key to your EC2 instance:
   ```bash
   # SSH into your instance with existing key
   ssh -i existing-key.pem ec2-user@YOUR_EC2_IP
   
   # Add new public key
   echo "YOUR_PUBLIC_KEY" >> ~/.ssh/authorized_keys
   ```

#### Reading the Key File

**Windows (PowerShell):**
```powershell
Get-Content "C:\path\to\your-key.pem"
```

**Mac/Linux:**
```bash
cat ~/.ssh/your-key.pem
```

⚠️ **Important:** Copy the ENTIRE content including:
- `-----BEGIN RSA PRIVATE KEY-----`
- All the lines in between
- `-----END RSA PRIVATE KEY-----`

---

## 🗄️ Supabase Credentials

### Step 1: Access Project Settings

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project (or create one)
3. Click **Project Settings** (gear icon in sidebar)
4. Go to **API** section

### Step 2: Copy Values

On the API settings page, find:

#### Project URL
```
NEXT_PUBLIC_SUPABASE_URL: https://xxxxxxxxxxxx.supabase.co
```

#### Anon/Public Key
Under **Project API keys**, copy the `anon` `public` key:
```
NEXT_PUBLIC_SUPABASE_ANON_KEY: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhneWJ...
```

⚠️ **Note:** The anon key is safe to expose in client-side code. Never expose the `service_role` key!

---

## 🚀 Setting Secrets in GitHub

### Method 1: GitHub CLI (Recommended)

```powershell
# Set each secret
gh secret set AWS_ACCESS_KEY_ID --body "AKIAXXXXXXXXXXXXXXXX"
gh secret set AWS_SECRET_ACCESS_KEY --body "your-secret-key"
gh secret set EC2_HOST --body "54.123.45.67"
gh secret set EC2_USER --body "ec2-user"
gh secret set NEXT_PUBLIC_SUPABASE_URL --body "https://xxx.supabase.co"
gh secret set NEXT_PUBLIC_SUPABASE_ANON_KEY --body "eyJhbGci..."

# For SSH key (read from file)
gh secret set EC2_SSH_PRIVATE_KEY < "C:\path\to\your-key.pem"
```

### Method 2: GitHub Web UI

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret with its name and value
5. Click **Add secret**

---

## ✅ Verification Checklist

After setting all secrets, verify:

```powershell
# List all secrets (values are hidden)
gh secret list
```

Expected output:
```
NAME                           UPDATED
AWS_ACCESS_KEY_ID              now
AWS_SECRET_ACCESS_KEY          now
EC2_HOST                       now
EC2_USER                       now
EC2_SSH_PRIVATE_KEY            now
NEXT_PUBLIC_SUPABASE_URL       now
NEXT_PUBLIC_SUPABASE_ANON_KEY  now
```

---

## 🔧 Troubleshooting

### SSH Authentication Failed

**Error:** `ssh: unable to authenticate, attempted methods [none publickey]`

**Solutions:**
1. Verify the private key is complete (includes BEGIN/END headers)
2. Ensure the key matches the EC2 instance's authorized keys
3. Check the EC2_USER matches your AMI type
4. Verify the EC2 security group allows SSH (port 22) from GitHub Actions IPs

### AWS Authentication Failed

**Error:** `The security token included in the request is invalid`

**Solutions:**
1. Regenerate AWS access keys
2. Verify the IAM user has correct permissions
3. Check for extra whitespace in the secret values

### ECR Push Failed

**Error:** `denied: Your authorization token has expired`

**Solutions:**
1. Verify `AmazonEC2ContainerRegistryFullAccess` policy is attached
2. Check the AWS_REGION matches your ECR region

---

## 📁 Quick Reference

Copy this template and fill in your values:

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
EC2_HOST=
EC2_USER=ec2-user
EC2_SSH_PRIVATE_KEY=(paste .pem content)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## 🔗 Useful Links

- [AWS IAM Console](https://console.aws.amazon.com/iam/)
- [AWS EC2 Console](https://console.aws.amazon.com/ec2/)
- [AWS ECR Console](https://console.aws.amazon.com/ecr/)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [GitHub Encrypted Secrets Docs](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

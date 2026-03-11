# Create ECR Repository - Quick Setup

The GitHub Actions deployment is failing because the ECR repository doesn't exist yet.

**Error:**
```
name unknown: The repository with name 'pitalrecord-web' does not exist in the registry with id '209695252110'
```

## Solution: Create the ECR Repository

Choose one of the methods below:

---

## Method 1: AWS Console (Easiest) ⚡

### Steps:

1. **Go to ECR Console:**
   - Open: https://console.aws.amazon.com/ecr/repositories
   - Or search "ECR" in AWS Console

2. **Click "Create repository"**

3. **Configure repository:**
   - **Repository name:** `pitalrecord-web`
   - **Visibility:** Private (recommended)
   - **Image tag mutability:** Mutable (allows overwriting tags like `latest`)
   - **Scan on push:** Enable (recommended for security)
   - **Encryption:** AES-256 (default is fine)

4. **Click "Create repository"**

5. **Verify creation:**
   - You should see the repository listed
   - Note the repository URI: `209695252110.dkr.ecr.us-east-1.amazonaws.com/pitalrecord-web`

✅ **Done!** Now retry your GitHub Actions workflow.

---

## Method 2: AWS CLI (For Developers) 💻

### Prerequisites

Install AWS CLI if not already installed:

**Windows (PowerShell):**
```powershell
# Download and install AWS CLI
msiexec.exe /i https://awscli.amazonaws.com/AWSCLIV2.msi

# Or using winget
winget install -e --id Amazon.AWSCLI
```

**macOS:**
```bash
brew install awscli
```

**Linux:**
```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
```

### Create the Repository

```bash
# Create ECR repository
aws ecr create-repository \
  --repository-name pitalrecord-web \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256

# Expected output:
# {
#     "repository": {
#         "repositoryArn": "arn:aws:ecr:us-east-1:209695252110:repository/pitalrecord-web",
#         "registryId": "209695252110",
#         "repositoryName": "pitalrecord-web",
#         "repositoryUri": "209695252110.dkr.ecr.us-east-1.amazonaws.com/pitalrecord-web",
#         "createdAt": "2026-03-11T...",
#         "imageTagMutability": "MUTABLE",
#         "imageScanningConfiguration": {
#             "scanOnPush": true
#         },
#         "encryptionConfiguration": {
#             "encryptionType": "AES256"
#         }
#     }
# }
```

### Verify Repository Exists

```bash
aws ecr describe-repositories \
  --repository-names pitalrecord-web \
  --region us-east-1
```

✅ **Done!** Now retry your GitHub Actions workflow.

---

## Method 3: CloudFormation/IaC (Advanced) 🏗️

If you want infrastructure as code:

**CloudFormation Template:**

```yaml
# ecr-repository.yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: 'ECR Repository for PitalRecord'

Resources:
  PitalRecordECRRepository:
    Type: AWS::ECR::Repository
    Properties:
      RepositoryName: pitalrecord-web
      ImageScanningConfiguration:
        ScanOnPush: true
      EncryptionConfiguration:
        EncryptionType: AES256
      LifecyclePolicy:
        LifecyclePolicyText: |
          {
            "rules": [
              {
                "rulePriority": 1,
                "description": "Keep last 10 images",
                "selection": {
                  "tagStatus": "any",
                  "countType": "imageCountMoreThan",
                  "countNumber": 10
                },
                "action": {
                  "type": "expire"
                }
              }
            ]
          }
      Tags:
        - Key: Project
          Value: PitalRecord
        - Key: Environment
          Value: Production

Outputs:
  RepositoryUri:
    Description: ECR Repository URI
    Value: !GetAtt PitalRecordECRRepository.RepositoryUri
    Export:
      Name: PitalRecordECRRepositoryUri
```

**Deploy:**
```bash
aws cloudformation create-stack \
  --stack-name pitalrecord-ecr \
  --template-body file://ecr-repository.yaml \
  --region us-east-1
```

---

## After Creating the Repository

### 1. Verify GitHub Secret

Ensure `ECR_REPOSITORY_NAME` is set correctly:

1. Go to: https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions
2. Check `ECR_REPOSITORY_NAME` = `pitalrecord-web`

### 2. Retry GitHub Actions

1. Go to: https://github.com/AbinVarghexe/pitalrecord/actions
2. Click on the failed workflow
3. Click "Re-run all jobs"

### 3. Expected Success Output

```
✓ Login to Amazon ECR
✓ Build Docker image
✓ Push to ECR: 209695252110.dkr.ecr.us-east-1.amazonaws.com/pitalrecord-web:latest
✓ Deploy to EC2
```

---

## Configure Repository Lifecycle Policy (Optional)

To automatically clean up old images:

```bash
aws ecr put-lifecycle-policy \
  --repository-name pitalrecord-web \
  --lifecycle-policy-text '{
    "rules": [
      {
        "rulePriority": 1,
        "description": "Keep last 10 images",
        "selection": {
          "tagStatus": "any",
          "countType": "imageCountMoreThan",
          "countNumber": 10
        },
        "action": {
          "type": "expire"
        }
      }
    ]
  }' \
  --region us-east-1
```

This will keep only the last 10 images and delete older ones to save storage costs.

---

## Troubleshooting

### Issue: "Access Denied" when creating repository

**Solution:** Ensure your IAM user has these permissions:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:CreateRepository",
        "ecr:DescribeRepositories",
        "ecr:PutLifecyclePolicy",
        "ecr:SetRepositoryPolicy"
      ],
      "Resource": "*"
    }
  ]
}
```

### Issue: Repository already exists

If you see "RepositoryAlreadyExistsException":
- The repository already exists!
- Go to: https://console.aws.amazon.com/ecr/repositories
- Verify the repository name matches `pitalrecord-web`

### Issue: Wrong region

Ensure you're creating in the same region as configured in GitHub Secrets:
- Check `AWS_REGION` secret (should be `us-east-1`)
- Create repository in matching region

---

## Cost Information

### ECR Storage Costs

- **First 50 GB/month:** $0.10 per GB
- **Over 50 GB/month:** $0.085 per GB
- **Data transfer out:** $0.09 per GB (to internet)

### Typical Costs for This Project

- **Image size:** ~200-300 MB per image
- **Keep last 10 images:** ~2-3 GB total
- **Monthly cost:** ~$0.20-$0.30
- **With lifecycle policy:** Costs stay constant

---

## Next Steps After Repository Creation

1. ✅ Create ECR repository (you're doing this now)
2. ⏳ Create EC2 instance (if not done yet)
3. ⏳ Configure EC2 with Docker and AWS CLI
4. ⏳ Add all GitHub Secrets
5. ⏳ Deploy via GitHub Actions

See: [AWS_DEPLOYMENT_GUIDE.md](./AWS_DEPLOYMENT_GUIDE.md) for complete setup.

---

## Quick Reference

| Action | Command |
|--------|---------|
| **Create repo** | `aws ecr create-repository --repository-name pitalrecord-web --region us-east-1` |
| **List repos** | `aws ecr describe-repositories --region us-east-1` |
| **Delete repo** | `aws ecr delete-repository --repository-name pitalrecord-web --force --region us-east-1` |
| **List images** | `aws ecr list-images --repository-name pitalrecord-web --region us-east-1` |
| **Delete image** | `aws ecr batch-delete-image --repository-name pitalrecord-web --image-ids imageTag=TAG` |

---

## AWS Console Quick Links

- **ECR Repositories:** https://console.aws.amazon.com/ecr/repositories?region=us-east-1
- **IAM Policies:** https://console.aws.amazon.com/iam/home?region=us-east-1#/policies
- **CloudFormation:** https://console.aws.amazon.com/cloudformation/home?region=us-east-1

---

**Once the repository is created, retry your GitHub Actions workflow and it should succeed!** 🚀

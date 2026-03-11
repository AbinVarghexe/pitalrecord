# 🚨 Fixing IAM Permission Error

## Error Encountered

```
Error: User: arn:aws:iam::209695252110:user/Abin is not authorized to perform: 
ecr:GetAuthorizationToken on resource: * because no identity-based policy 
allows the ecr:GetAuthorizationToken action
```

## Root Cause

Your IAM user `Abin` doesn't have the necessary permissions to:
- Authenticate to Amazon ECR (Elastic Container Registry)
- Push/pull Docker images
- Access ECR repositories

## Quick Fix (3 methods)

### Method 1: AWS Console - Attach Managed Policy (Fastest) ⚡

1. **Open IAM Console:** https://console.aws.amazon.com/iam/
2. **Navigate:** Users → `Abin`
3. **Click:** "Add permissions" button
4. **Select:** "Attach policies directly"
5. **Search and attach:** `AmazonEC2ContainerRegistryPowerUser`
6. **Click:** "Add permissions"

✅ **Done!** Retry your GitHub Actions workflow.

---

### Method 2: AWS Console - Custom Policy (Recommended) 🔐

**More secure - grants only what's needed for this project.**

1. **Open IAM Console:** https://console.aws.amazon.com/iam/
2. **Navigate:** Users → `Abin` → Permissions tab
3. **Click:** "Add permissions" → "Create inline policy"
4. **Click:** JSON tab
5. **Paste the policy from:** `docs/IAM_POLICY.json`
6. **Name the policy:** `PitalRecordECRAccess`
7. **Click:** "Create policy"

✅ **Done!** Retry your GitHub Actions workflow.

---

### Method 3: AWS CLI (For Developers) 💻

#### Step 1: Create the policy

```bash
# Navigate to project directory
cd d:/DEV/Projects/pitalrecord/pitalrecord

# Create the IAM policy
aws iam create-policy \
  --policy-name PitalRecordECRAccess \
  --policy-document file://docs/IAM_POLICY.json
```

You'll get output like:
```json
{
  "Policy": {
    "PolicyName": "PitalRecordECRAccess",
    "PolicyId": "ANPXXXXXXXXXXXXXXXXXX",
    "Arn": "arn:aws:iam::209695252110:policy/PitalRecordECRAccess",
    ...
  }
}
```

#### Step 2: Attach the policy to your user

```bash
# Using the ARN from the previous step
aws iam attach-user-policy \
  --user-name Abin \
  --policy-arn arn:aws:iam::209695252110:policy/PitalRecordECRAccess
```

#### Step 3: Verify the policy is attached

```bash
aws iam list-attached-user-policies --user-name Abin
```

Expected output:
```json
{
  "AttachedPolicies": [
    {
      "PolicyName": "PitalRecordECRAccess",
      "PolicyArn": "arn:aws:iam::209695252110:policy/PitalRecordECRAccess"
    }
  ]
}
```

✅ **Done!** Retry your GitHub Actions workflow.

---

## What the Policy Grants

The custom policy (`docs/IAM_POLICY.json`) grants:

### 1. ECR Authentication
- `ecr:GetAuthorizationToken` - Login to ECR

### 2. ECR Repository Operations
- `ecr:BatchCheckLayerAvailability` - Check if image layers exist
- `ecr:GetDownloadUrlForLayer` - Download image layers
- `ecr:BatchGetImage` - Pull Docker images
- `ecr:PutImage` - Push Docker images
- `ecr:InitiateLayerUpload` - Start uploading image layers
- `ecr:UploadLayerPart` - Upload image layer parts
- `ecr:CompleteLayerUpload` - Finish uploading image layers
- `ecr:DescribeRepositories` - List repositories
- `ecr:GetRepositoryPolicy` - Read repository policies
- `ecr:ListImages` - List images in repository
- `ecr:DescribeImages` - Get image metadata

### Scope
- **Account:** `209695252110` (your AWS account)
- **Resources:** All ECR repositories in your account
- **Regions:** All regions (adjust if you want region-specific)

---

## After Applying the Fix

### 1. Verify Permissions

Test if the user can authenticate to ECR:

```bash
aws ecr get-login-password --region us-east-1
```

If you see a long password string, permissions are working! ✅

### 2. Retry GitHub Actions

Go to your GitHub repository and retry the failed workflow:
1. https://github.com/AbinVarghexe/pitalrecord/actions
2. Click on the failed workflow run
3. Click "Re-run all jobs"

### 3. Expected Success Output

You should see:
```
Run aws-actions/amazon-ecr-login@v2
✓ Logging into Amazon ECR...
✓ Login successful
```

---

## Alternative: Use a Different IAM User

If you don't want to modify the `Abin` user, create a dedicated user for GitHub Actions:

### Create New IAM User

```bash
# Create user
aws iam create-user --user-name github-actions-pitalrecord

# Create access keys
aws iam create-access-key --user-name github-actions-pitalrecord

# Attach the policy
aws iam attach-user-policy \
  --user-name github-actions-pitalrecord \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser
```

Then update GitHub Secrets with the new credentials:
1. https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions
2. Update `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

---

## Security Best Practices

### ✅ DO

- ✅ Use dedicated IAM users for CI/CD (not personal accounts)
- ✅ Apply least privilege principle
- ✅ Rotate access keys every 90 days
- ✅ Enable CloudTrail to log ECR API calls
- ✅ Use IAM roles for EC2 instances instead of access keys
- ✅ Review IAM policies regularly

### ❌ DON'T

- ❌ Use root account credentials
- ❌ Give `*:*` permissions (full access)
- ❌ Share IAM credentials across projects
- ❌ Commit access keys to git
- ❌ Use the same user for development and CI/CD

---

## Troubleshooting

### Issue: Policy still not working after attachment

**Wait 10-30 seconds** for IAM changes to propagate globally, then retry.

### Issue: "Policy already exists" error

The policy name is taken. Either:
- Use Method 1 (managed policy) instead
- Choose a different policy name
- Delete the existing policy first

### Issue: Can't find the IAM user

Verify you're in the correct AWS account:
```bash
aws sts get-caller-identity
```

Should show account `209695252110`.

### Issue: GitHub Actions still failing

1. Check GitHub Secrets are correct
2. Verify AWS region matches (check both `AWS_REGION` secret and ECR repository region)
3. Ensure ECR repository exists: `aws ecr describe-repositories`
4. Check IAM policy is attached: `aws iam list-attached-user-policies --user-name Abin`

---

## Need More Help?

### Check Current Permissions

```bash
# List all policies attached to user
aws iam list-attached-user-policies --user-name Abin

# List inline policies
aws iam list-user-policies --user-name Abin

# Get specific policy details
aws iam get-user-policy --user-name Abin --policy-name PolicyName
```

### Test ECR Access

```bash
# Test authentication
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 209695252110.dkr.ecr.us-east-1.amazonaws.com

# List repositories
aws ecr describe-repositories --region us-east-1

# List images in your repository
aws ecr list-images --repository-name pitalrecord-web --region us-east-1
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| **Attach managed policy** | `aws iam attach-user-policy --user-name Abin --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser` |
| **List user policies** | `aws iam list-attached-user-policies --user-name Abin` |
| **Test ECR auth** | `aws ecr get-login-password --region us-east-1` |
| **List ECR repos** | `aws ecr describe-repositories` |
| **Detach policy** | `aws iam detach-user-policy --user-name Abin --policy-arn <arn>` |

---

## Summary

**The fix is simple:**

1. Go to [IAM Console](https://console.aws.amazon.com/iam/)
2. Users → `Abin` → Add permissions
3. Attach policy: `AmazonEC2ContainerRegistryPowerUser`
4. Retry GitHub Actions

**Or use the custom policy:** `docs/IAM_POLICY.json` (more secure)

✅ **After applying permissions, your deployment will work!**

---

**Related Documentation:**
- [AWS Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md)
- [Credentials Guide](./CREDENTIALS_GUIDE.md)
- [Setup Guide](../SETUP.md)

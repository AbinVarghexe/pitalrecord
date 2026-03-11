# Docker Build Troubleshooting

Common Docker build issues and their solutions for the PitalRecord project.

---

## ✅ FIXED: Missing `public` Directory Error

### Error Message

```
ERROR: failed to calculate checksum of ref: "/app/apps/web/public": not found
```

### Root Cause

The `apps/web/public` directory didn't exist in the repository, causing the Docker COPY command to fail.

### Solution Applied

1. Created `apps/web/public/` directory with a README.md file
2. Updated Dockerfile comments for clarity
3. Committed and pushed changes

### Result

✅ The `public` directory now exists and Docker build completes successfully.

---

## Common Docker Build Issues

### 1. Node Modules Cache Issues

**Error:**
```
COPY --from=builder /app/node_modules ./node_modules
DONE 9.5s (should be faster on cache hit)
```

**Solution:**
```bash
# Clear Docker build cache
docker builder prune -af

# Rebuild
docker-compose build --no-cache
```

---

### 2. Build Context Too Large

**Error:**
```
Sending build context to Docker daemon  2.5GB
```

**Solution:**

Ensure `.dockerignore` is comprehensive:
```
node_modules
.next
.turbo
dist
.git
*.log
.env*
!.env.example
```

---

### 3. Environment Variables Not Available

**Error:**
```
Error: NEXT_PUBLIC_SUPABASE_URL is required
```

**Solution:**

Ensure build args are passed:
```dockerfile
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
```

And in GitHub Actions:
```yaml
docker build \
  --build-arg NEXT_PUBLIC_SUPABASE_URL=${{ secrets.NEXT_PUBLIC_SUPABASE_URL }} \
  --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=${{ secrets.NEXT_PUBLIC_SUPABASE_ANON_KEY }} \
  ...
```

---

### 4. pnpm Lock File Mismatch

**Error:**
```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date
```

**Solution:**
```bash
# Update lockfile
pnpm install

# Commit changes
git add pnpm-lock.yaml
git commit -m "Update pnpm-lock.yaml"
git push
```

---

### 5. Multi-stage Build Path Issues

**Error:**
```
COPY --from=builder /app/apps/web/.next/standalone ./
ERROR: file not found
```

**Solution:**

Verify Next.js config has standalone output:
```js
// next.config.mjs
export default {
  output: 'standalone',
  // ...
}
```

---

### 6. File Permission Issues

**Error:**
```
EACCES: permission denied
```

**Solution:**

Ensure proper ownership in Dockerfile:
```dockerfile
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next/standalone ./
```

---

### 7. Out of Memory During Build

**Error:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**

Increase Node memory in Dockerfile:
```dockerfile
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN pnpm run build
```

Or in GitHub Actions:
```yaml
- name: Build Docker image
  env:
    NODE_OPTIONS: --max-old-space-size=4096
  run: docker build ...
```

---

### 8. Alpine Linux glibc Issues

**Error:**
```
Error loading shared library libstdc++.so.6: No such file or directory
```

**Solution:**

Already handled in Dockerfile with:
```dockerfile
RUN apk add --no-cache libc6-compat
```

---

### 9. Turbo Cache Issues

**Error:**
```
turbo cache miss on every build
```

**Solution:**

For local development:
```bash
# Clear turbo cache
rm -rf .turbo

# Rebuild
pnpm build
```

For remote caching, see: [Turborepo Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)

---

### 10. Docker Layer Caching Not Working

**Issue:** Slow builds even with no changes

**Solution:**

Enable Docker BuildKit:
```bash
export DOCKER_BUILDKIT=1
export COMPOSE_DOCKER_CLI_BUILD=1
```

In GitHub Actions (already configured):
```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
```

---

## Debugging Commands

### Check Docker Build Steps

```bash
# Build with verbose output
docker build --progress=plain -t test .

# Build without cache
docker build --no-cache -t test .

# Build specific stage
docker build --target builder -t test-builder .
```

### Inspect Built Image

```bash
# List files in image
docker run --rm test ls -la /app

# Check environment variables
docker run --rm test env

# Interactive shell
docker run --rm -it test sh
```

### Check Image Size

```bash
# Show image layers
docker history pitalrecord-web:latest

# Show total size
docker images pitalrecord-web
```

---

## GitHub Actions Specific Issues

### 1. ECR Login Failure (FIXED)

**Error:**
```
Error: User is not authorized to perform: ecr:GetAuthorizationToken
```

**Solution:**

See: [docs/FIXING_IAM_PERMISSIONS.md](./FIXING_IAM_PERMISSIONS.md)

### 2. SSH Connection to EC2 Failure

**Error:**
```
Permission denied (publickey)
```

**Solution:**

Verify GitHub secret `EC2_SSH_PRIVATE_KEY`:
- Contains complete .pem file content
- Includes `-----BEGIN RSA PRIVATE KEY-----` and `-----END RSA PRIVATE KEY-----`
- No extra whitespace or line breaks

### 3. Docker Image Push Timeout

**Error:**
```
Error: failed to push: context deadline exceeded
```

**Solution:**

Image might be too large. Optimize:
```dockerfile
# Use multi-stage builds (already done)
# Remove unnecessary files
RUN rm -rf /app/.next/cache
```

### 4. Secrets Not Available

**Error:**
```
Error: Required secret 'AWS_ACCESS_KEY_ID' is not set
```

**Solution:**

Verify all 9 secrets at:
https://github.com/AbinVarghexe/pitalrecord/settings/secrets/actions

---

## Best Practices

### ✅ DO

- Use `.dockerignore` to exclude unnecessary files
- Use multi-stage builds to minimize image size
- Pin specific versions of dependencies
- Use non-root user in production stage
- Cache dependencies separately from source code
- Use BuildKit for better caching

### ❌ DON'T

- Include `.env` files in Docker images
- Run as root user in production
- Copy entire project without `.dockerignore`
- Use `latest` tags in production
- Skip vulnerability scanning
- Ignore build warnings

---

## Monitoring Build Performance

### Local Build Times (Expected)

| Stage | Time |
|-------|------|
| Dependencies | 12-15s (first run), 0.1s (cached) |
| Builder | 13-15s (first run), 0.1s (cached) |
| Runner | 1-2s |
| **Total** | **27-32s** (first run), **1-3s** (cached) |

### GitHub Actions Build Times (Expected)

| Step | Time |
|------|------|
| Checkout | 1s |
| Configure AWS | 1s |
| ECR Login | 4s |
| Setup Buildx | 49s |
| Build & Push | 50-70s |
| Deploy to EC2 | 20-30s |
| **Total** | **~2-3 minutes** |

If builds are significantly slower, investigate caching issues.

---

## Quick Fix Checklist

When build fails:

- [ ] Check GitHub Actions logs at: https://github.com/AbinVarghexe/pitalrecord/actions
- [ ] Identify the failing step and error message
- [ ] Search this document for the error
- [ ] Try the suggested solution
- [ ] Clear caches if needed: `docker builder prune -af`
- [ ] Retry the workflow: Re-run failed jobs button
- [ ] If still failing, check:
  - [ ] All GitHub secrets are set correctly
  - [ ] IAM permissions are correct
  - [ ] EC2 instance is running
  - [ ] ECR repository exists
  - [ ] Network connectivity

---

## Getting Help

1. **Check logs:**
   - GitHub Actions: https://github.com/AbinVarghexe/pitalrecord/actions
   - Docker: `docker logs <container-id>`
   - EC2: `ssh ec2-user@YOUR_IP` then `docker logs pitalrecord-web`

2. **Review documentation:**
   - [AWS Deployment Guide](./AWS_DEPLOYMENT_GUIDE.md)
   - [IAM Permissions Fix](./FIXING_IAM_PERMISSIONS.md)
   - [Credentials Guide](./CREDENTIALS_GUIDE.md)

3. **Test locally first:**
   ```bash
   docker-compose build
   docker-compose up
   ```

4. **Enable debug logging:**
   ```yaml
   # In GitHub Actions
   - name: Build with debug
     env:
       DOCKER_BUILDKIT: 1
       BUILDKIT_PROGRESS: plain
     run: docker build ...
   ```

---

## Related Documentation

- [Dockerfile](../Dockerfile) - Multi-stage build configuration
- [.dockerignore](../.dockerignore) - Files excluded from build context
- [docker-compose.yml](../docker-compose.yml) - Local development setup
- [GitHub Actions Workflow](../.github/workflows/deploy.yml) - CI/CD pipeline

---

**Last Updated:** March 11, 2026  
**Status:** ✅ All known issues resolved

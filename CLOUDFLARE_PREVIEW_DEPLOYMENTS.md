# Cloudflare Pages Preview Deployments Guide

## What are Preview Deployments?

Preview deployments allow you to test changes before they go to production. Each commit or pull request can get its own preview URL.

## Automatic Preview Deployments

Cloudflare Pages automatically creates preview deployments for:

1. **Pull Requests** - Every PR gets a unique preview URL
2. **Branches** - If you push to a branch, it gets a preview URL
3. **Commits** - Specific commits can be deployed as previews

## How to Create a Preview Deployment

### Method 1: Create a Branch (Recommended)

```bash
# Create a new branch from main
git checkout -b preview/kyc-updates

# Make your changes
git add .
git commit -m "Your changes"
git push origin preview/kyc-updates
```

Cloudflare will automatically create a preview deployment for this branch.

### Method 2: Use Pull Request

1. Create a branch and push changes
2. Open a Pull Request on GitHub
3. Cloudflare automatically creates a preview deployment
4. You'll see the preview URL in the PR comments

### Method 3: Manual Deployment from Dashboard

1. Go to Cloudflare Dashboard → Pages → Your Project
2. Click on "Deployments" tab
3. Find the commit you want to preview
4. Click the three dots (⋯) next to the deployment
5. Select "Retry deployment" or "Create preview"

## Preview URL Format

Preview deployments get URLs like:
- `https://preview-abc123.your-project.pages.dev`
- `https://preview-xyz789.your-project.pages.dev`

The preview URL is unique for each deployment.

## Viewing Preview Deployments

### In Cloudflare Dashboard:
1. Go to Pages → Your Project
2. Click "Deployments" tab
3. You'll see all deployments (production and previews)
4. Preview deployments are marked with a "Preview" badge

### In GitHub:
- Preview URLs appear in Pull Request comments
- You can also check the "Checks" tab in PRs

## Environment Variables for Previews

Preview deployments inherit environment variables from:
1. Project-level environment variables (applied to all deployments)
2. Preview-specific environment variables (if configured)

To set preview-specific variables:
1. Go to Pages → Your Project → Settings → Environment Variables
2. Select "Preview" environment
3. Add variables (these only apply to preview deployments)

## Deploying Current Commit as Preview

If you want to deploy the current commit as a preview:

### Option 1: Create a Branch
```bash
git checkout -b preview/current-commit
git push origin preview/current-commit
```

### Option 2: Use Wrangler CLI (if installed)
```bash
npx wrangler pages deployment create --project-name=your-project-name
```

### Option 3: Via Cloudflare Dashboard
1. Go to Pages → Your Project → Deployments
2. Find your commit
3. Click "Retry deployment" to create a new preview

## Best Practices

1. **Use Branches for Previews**: Create feature branches for testing
2. **Name Branches Clearly**: Use prefixes like `preview/`, `feature/`, `fix/`
3. **Clean Up Old Previews**: Delete branches after merging to keep things tidy
4. **Test Before Merging**: Always test preview deployments before merging to main

## Current Status

Your latest commit has been pushed to `main` branch, which will automatically deploy to production.

To create a preview instead:
1. Create a new branch: `git checkout -b preview/test-changes`
2. Make your changes and commit
3. Push: `git push origin preview/test-changes`
4. Cloudflare will create a preview deployment automatically

## Troubleshooting

### Preview Not Created?
- Check that Cloudflare Pages is connected to your GitHub repo
- Verify branch protection rules allow deployments
- Check Cloudflare dashboard for any errors

### Preview URL Not Working?
- Wait a few minutes for deployment to complete
- Check build logs in Cloudflare dashboard
- Verify environment variables are set correctly

### Can't See Preview in Dashboard?
- Make sure you're looking at the correct project
- Check "Deployments" tab, not "Settings"
- Preview deployments might be on a different page


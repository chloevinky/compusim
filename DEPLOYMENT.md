# Deployment Guide

This guide explains how to deploy the Retro Computer Store Ad Generator to GitHub Pages with a serverless proxy.

## Overview

Since GitHub Pages only hosts static files, we need to deploy the API proxy separately. This guide shows you how to deploy to:
- **GitHub Pages**: Hosts the frontend (HTML, CSS, JavaScript)
- **Vercel or Netlify**: Hosts the API proxy serverless function

## Prerequisites

1. A GitHub account
2. A Vercel or Netlify account (free tier works!)
3. Anthropic API key
4. OpenAI API key

## Deployment Steps

### Step 1: Fork the Repository

1. Go to the repository on GitHub
2. Click the "Fork" button in the top right
3. This creates your own copy of the repository

### Step 2: Deploy the Proxy to Vercel

#### 2a. Sign Up for Vercel

1. Go to [vercel.com](https://vercel.com/)
2. Sign up with your GitHub account
3. Authorize Vercel to access your repositories

#### 2b. Import Your Repository

1. Click "Add New..." → "Project"
2. Select your forked `compusim` repository
3. Click "Import"

#### 2c. Configure the Project

- **Framework Preset**: Other (leave as default)
- **Root Directory**: `./` (leave as default)
- **Build Command**: Leave empty
- **Output Directory**: Leave empty

Click "Deploy"

#### 2d. Get Your Vercel URL

After deployment completes, Vercel will show your URL:
```
https://your-project-name.vercel.app
```

Copy this URL - you'll need it in the next step!

### Step 3: Configure the Proxy URL

#### 3a. Clone Your Forked Repository

```bash
git clone https://github.com/YOUR-USERNAME/compusim.git
cd compusim
```

#### 3b. Edit config.js

Open `config.js` and update the `ANTHROPIC_PROXY_URL`:

```javascript
// Replace with your Vercel URL + /api/anthropic
window.ANTHROPIC_PROXY_URL = 'https://your-project-name.vercel.app/api/anthropic';
```

#### 3c. Commit and Push

```bash
git add config.js
git commit -m "Configure proxy URL for GitHub Pages deployment"
git push origin main
```

### Step 4: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings"
3. Scroll down to "Pages" in the left sidebar
4. Under "Source":
   - Select "Deploy from a branch"
   - Branch: `main` (or your default branch)
   - Folder: `/ (root)`
5. Click "Save"

GitHub will build and deploy your site. This takes 1-2 minutes.

### Step 5: Access Your Deployed App

Your app will be available at:
```
https://YOUR-USERNAME.github.io/compusim/
```

You can now:
1. Enter your Anthropic API key
2. Enter your OpenAI API key
3. Select a year
4. Generate retro computer ads!

## Alternative: Deploy Proxy to Netlify

If you prefer Netlify over Vercel:

### Step 1: Sign Up for Netlify

1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up with your GitHub account

### Step 2: Deploy Your Repository

1. Click "Add new site" → "Import an existing project"
2. Choose GitHub and select your repository
3. Configure:
   - **Build command**: Leave empty
   - **Publish directory**: `.` (current directory)
4. Click "Deploy site"

### Step 3: Get Your Netlify URL

After deployment, you'll get a URL like:
```
https://your-site-name.netlify.app
```

### Step 4: Configure and Deploy

Follow Steps 3-5 from the Vercel instructions above, but use your Netlify URL:

```javascript
window.ANTHROPIC_PROXY_URL = 'https://your-site-name.netlify.app/api/anthropic';
```

## Troubleshooting Deployment

### Issue: "CORS error" after deployment

**Cause**: The proxy URL is not configured correctly

**Solution**:
1. Check that `config.js` has the correct Vercel/Netlify URL
2. Make sure the URL ends with `/api/anthropic`
3. Verify the change was committed and pushed to GitHub
4. Wait a few minutes for GitHub Pages to rebuild

### Issue: "Failed to fetch" on deployed site

**Cause**: The serverless function isn't working

**Solution**:
1. Check your Vercel/Netlify deployment logs
2. Make sure `api/anthropic.js` was deployed correctly
3. Test the proxy directly:
   ```
   https://your-app.vercel.app/api/anthropic
   ```
   Should return a CORS error (that's OK - means it's working)

### Issue: API keys don't work on deployed site

**Cause**: API keys are entered incorrectly

**Solution**:
1. Make sure you copied the full API key (no extra spaces)
2. Anthropic keys start with `sk-ant-`
3. OpenAI keys start with `sk-`
4. Try the keys locally first to verify they work

### Issue: Images don't load

**Cause**: OpenAI API issue (not related to deployment)

**Solution**:
1. Check your OpenAI API key
2. Verify you have credits in your OpenAI account
3. Check the browser console for specific error messages

## Security Considerations

⚠️ **Important**: API keys are entered by users in the browser and sent to the APIs. This is suitable for:
- Personal use
- Demos
- Learning projects

For production apps with many users:
- Store API keys server-side
- Implement user authentication
- Add rate limiting
- Use environment variables for sensitive data

## Updating Your Deployment

To update your deployed app:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin main
   ```
3. Both Vercel/Netlify and GitHub Pages will automatically redeploy

## Cost Considerations

- **GitHub Pages**: Free
- **Vercel Free Tier**:
  - 100 GB bandwidth/month
  - Serverless function executions: Generous free tier
- **Netlify Free Tier**:
  - 100 GB bandwidth/month
  - 125K function requests/month

For personal use, the free tiers should be more than sufficient!

## Need Help?

If you run into issues:
1. Check the [README.md](README.md) troubleshooting section
2. Check your browser console for error messages
3. Check Vercel/Netlify deployment logs
4. Open an issue on GitHub

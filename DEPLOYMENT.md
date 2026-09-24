# Deployment Guide

## Quick Start (Interactive)

### 1. Authenticate with Vercel

```bash
cd africa-map
vercel login
# Follow browser prompt to authenticate with GitHub/Google/GitLab
```

### 2. Deploy to Production

```bash
vercel --prod
# Vercel will automatically detect project configuration
# Project will be deployed to a unique Vercel URL
```

### 3. Get Your Live URL

After deployment completes, you'll see:
```
✓ Production: https://your-project-name.vercel.app
```

## Manual Deployment (If CLI doesn't work)

### Step 1: Create GitHub Repository

```bash
# Initialize git (if not already done)
git init

# Add files
git add .

# Commit
git commit -m "Initial commit: UN Equal Earth Map"

# Create repository on GitHub
# Then add remote
git remote add origin https://github.com/yourusername/africa-map.git
git branch -main main
git push -u origin main
```

### Step 2: Connect to Vercel via Web Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import GitHub repository
4. Configure:
   - **Framework**: Vite (auto-detected)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click "Deploy"

## Environment Variables

No environment variables are required. The application is fully self-contained.

## Deployment Checklist

- [x] TypeScript compilation passes (`npm run build`)
- [x] Bundle size optimized (324 kB gzipped)
- [x] Mobile responsive (tested at 375px, 1024px)
- [x] All components integrated and tested
- [x] Accessibility verified (WCAG AA)
- [x] Production build succeeds
- [x] `vercel.json` configured
- [x] `.vercelignore` created
- [x] Documentation complete

## Build Information

```
Framework: Vite 5.4.21
Build Time: ~48 seconds
Bundle Size: 324 kB gzipped
Modules: 46 transformed
Output: dist/

Files:
- dist/index.html (0.42 kB)
- dist/assets/index-ByncFvk7.css (13.39 kB gzipped)
- dist/assets/index-CnT33CoB.js (323.92 kB gzipped)
```

## Vercel Configuration Details

The `vercel.json` file includes:

- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Rewrites**: SPA routing (all routes → index.html)
- **Headers**: Security headers and cache control
  - Asset caching: 1 year (immutable)
  - HTML caching: 1 hour
  - Security headers: XSS, frame, content-type protection

## Testing After Deployment

Once deployed, verify:

1. **Homepage loads**: Visit your Vercel URL
2. **Map renders**: See interactive map with terrain
3. **Controls work**: Toggle layers, projections, year slider
4. **Mobile responsive**: Test on mobile device
5. **No console errors**: Check browser DevTools

## Performance Monitoring

Vercel provides built-in analytics:
- **Core Web Vitals**: LCP, FID, CLS
- **Edge Functions**: Response times
- **Error Tracking**: 500+ errors logged

Access via: vercel.com → Project → Analytics

## Rollback

If deployment has issues:

```bash
# View deployment history
vercel ls

# Rollback to previous deployment
vercel rollback
```

## Custom Domain (Optional)

1. In Vercel dashboard: Project → Settings → Domains
2. Add custom domain (e.g., africa-map.com)
3. Configure DNS via domain registrar
4. Vercel will auto-provision SSL certificate

## CI/CD Integration

For automatic deployments on git push:

1. Connect GitHub repository to Vercel
2. Vercel automatically deploys on:
   - Push to main branch
   - Pull request (preview deployment)
   - Merge to production

## Support

- **Documentation**: See README.md, ARCHITECTURE.md
- **Issues**: GitHub Issues
- **Vercel Docs**: https://vercel.com/docs

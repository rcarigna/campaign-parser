# 🚀 Deployment Guide

## Vercel Deployment (Recommended)

The Campaign Document Parser is optimized for deployment on Vercel with automatic branch deployments and smart build skipping.

### Quick Setup

1. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com) and sign in with GitHub
   - Click "New Project" and import `rcarigna/campaign-parser`
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

2. **Automatic Deployments**
   - **Production**: `main` branch → `https://campaign-parser.vercel.app`
   - **Preview**: All other branches → `https://campaign-parser-git-[branch-name].vercel.app`

### Smart Build Optimization

The project includes intelligent build skipping to save resources:

#### **Files that skip Vercel deployment:**

- `docs/**` - All documentation (served via GitHub Pages)
- `README.md`, `CONTRIBUTING.md` - Project documentation  
- `.github/**` - GitHub templates and workflows
- `index.md`, `_config.yml` - GitHub Pages files

#### **Files that trigger deployment:**

- `src/**`, `app/**` - Application code
- `package.json`, `vercel.json` - Dependencies and config
- `next.config.ts`, `tsconfig.json` - Build configuration

#### **How it works:**

```bash
# The ignore script analyzes git changes
scripts/ignore-build.sh

# Returns:
# Exit 0 = Skip deployment (docs-only)
# Exit 1 = Deploy (code changes)
```

### Configuration Files

#### `vercel.json`

- API route optimization (1GB memory, 30s timeout)
- CORS headers for `/api/*` endpoints
- Ignore command for docs-only changes
- Branch deployment settings

#### Environment Setup

Configure in Vercel dashboard → Project Settings → Environment Variables:

- **Production**: Values for main branch
- **Preview**: Values for feature branches
- **Development**: Local development overrides

### Alternative Deployment Options

#### Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=out
```

#### Docker

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

#### Railway

```bash
npm install -g @railway/cli
railway login
railway deploy
```

## Performance Optimization

### Build Performance

- React Compiler optimization enabled
- Telemetry disabled for faster builds
- Selective deployment reduces unnecessary builds

### Runtime Performance  

- API routes optimized for document processing
- Efficient entity extraction algorithms
- Client-side caching for better UX

## Monitoring & Analytics

### Vercel Analytics

- Automatically enabled for performance monitoring
- Real user metrics and Core Web Vitals
- API route performance tracking

### Error Tracking

- Built-in error boundaries in React components
- API error handling with proper status codes
- Client-side error reporting

## Troubleshooting

### Common Issues

#### Build Failures

```bash
# Check build locally
npm run build

# Verify dependencies
npm ci

# Check TypeScript
npm run type-check
```

#### Environment Variables

```bash
# List Vercel environment variables
vercel env ls

# Add new variable
vercel env add VARIABLE_NAME
```

#### API Route Issues

- Check function memory limits (1GB configured)
- Verify timeout settings (30s configured)
- Review CORS configuration for cross-origin requests

### Support

- **Vercel Issues**: Check Vercel dashboard logs
- **Build Problems**: Review GitHub Actions CI/CD results
- **Application Errors**: Check browser developer tools
- **API Issues**: Review Vercel function logs

---

**Last Updated**: November 5, 2025  
**Deployment Status**: ✅ Live on Vercel  
**Documentation**: 📚 GitHub Pages  
**CI/CD**: 🔄 GitHub Actions

# CI/CD Setup Guide

This project includes comprehensive CI/CD pipelines using GitHub Actions for automated testing, building, and deployment.

## 🚀 CI/CD Pipeline

### Workflow: `.github/workflows/ci-cd.yml`

**Triggers:** Push to `main`/`develop`, Pull Requests to `main`

**Jobs:**

- **Test**: Runs on Node.js 18.x and 20.x
  - Installs dependencies for both client and server
  - Runs ESLint for code quality
  - Executes Jest tests with coverage reporting
  - Uploads coverage to Codecov
- **Build**: Creates production builds
  - Builds React client with Vite
  - Compiles TypeScript server
  - Uploads build artifacts
- **Security Scan**: Vulnerability detection
  - npm audit for dependency vulnerabilities
  - Trivy security scanner

## 📋 Setup Instructions

### 1. Enable GitHub Actions

✅ GitHub Actions are automatically enabled for this repository

### 2. Configure Secrets (Optional)

For enhanced features, add these secrets in **Repository Settings → Secrets**:

```text
CODECOV_TOKEN=your_codecov_token  # For coverage reporting
```

### 3. Enable GitHub Pages (Optional)

For future manual deployment to GitHub Pages:

1. Go to **Repository Settings → Pages**
2. Source: **Deploy from a branch** or **GitHub Actions**
3. Configure as needed when ready to deploy

### 4. Production Deployment Options

When you're ready to deploy, choose your preferred platform and deploy manually:

#### Option A: Vercel (Frontend) + Railway (Backend)

```bash
# Install CLIs
npm install -g vercel railway

# Deploy frontend
cd client && npm run build
vercel --prod

# Deploy backend
cd ../server && npm run build
railway login && railway init && railway up
```

#### Option B: Heroku (Full-stack)

```bash
# Create Heroku apps
heroku create campaign-parser-client
heroku create campaign-parser-server

# Deploy manually when ready
git push heroku main
```

#### Option C: Manual GitHub Pages

```bash
# Build and deploy to gh-pages branch
npm run build:client
npx gh-pages -d client/dist
```

## 🧪 Local Testing

Before pushing, ensure everything works locally:

```bash
# Run all tests
npm test

# Run linting
npm run lint:all  # Add this script to root package.json

# Build everything
npm run build

# Test coverage
npm run test -- --coverage
```

## 📊 Monitoring & Quality Gates

### Coverage Requirements

- **Minimum Coverage**: 70% (branches, functions, lines, statements)
- **Reports**: Generated in `coverage/` directories
- **Integration**: Uploaded to Codecov (if configured)

### Code Quality

- **ESLint**: Enforces TypeScript and React best practices
- **No Warnings**: Pipeline fails on ESLint warnings
- **Security**: Automated vulnerability scanning

### Build Requirements

- **TypeScript**: Must compile without errors
- **Tests**: All tests must pass
- **Multiple Node Versions**: Tested on 18.x and 20.x

## 🔄 Workflow Triggers

| Event | Branches | Actions |
|-------|----------|---------|
| Push | `main` | Test + Build + Security Scan |
| Push | `develop` | Test + Build + Security Scan |
| Pull Request | → `main` | Test + Build + Security Scan |

**Note:** All deployment is now manual. The CI pipeline only validates code quality, runs tests, builds artifacts, and performs security scanning.

## 🚨 Troubleshooting

### Common Issues

1. **Tests Failing in CI**

   ```bash
   # Run tests exactly like CI
   npm ci
   npm test -- --coverage --watchAll=false
   ```

2. **Build Failures**

   ```bash
   # Check TypeScript compilation
   npx tsc --noEmit
   ```

3. **ESLint Errors**

   ```bash
   # Fix auto-fixable issues
   npm run lint -- --fix
   ```

4. **Coverage Below Threshold**
   - Add tests for uncovered code
   - Check `coverage/lcov-report/index.html` for details

## 🎯 Next Steps

1. **Add Integration Tests**: Test API endpoints with supertest
2. **E2E Testing**: Add Playwright for browser testing  

## 🚀 Deployment Strategy

With the deploy workflow removed, all deployments are **completely manual**. This gives you:

- **Full control** over when and how you deploy
- **No accidental deployments** from commits
- **Flexibility** to choose any deployment platform
- **CI validation** ensures code quality before manual deployment

Your CI pipeline will validate every commit with testing, building, and security scanning, but deployment timing is entirely up to you! 🎉

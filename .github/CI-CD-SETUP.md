# CI/CD Setup Guide - Next.js

This project includes comprehensive CI/CD pipelines using GitHub Actions for the unified Next.js application with automated testing, building, and deployment validation.

## 🚀 CI/CD Pipeline

### Workflow: `.github/workflows/ci-cd.yml`

**Triggers:** Push to `main`/`develop`/`feat/nextjs-migration`, Pull Requests to `main`

**Jobs:**

- **Test**: Runs on Node.js 18.x and 20.x
  - Installs Next.js dependencies
  - Runs ESLint for code quality
  - Validates TypeScript compilation
  - Executes Jest tests with coverage reporting (93 tests)
  - Uploads coverage to Codecov
- **Build**: Creates Next.js production build
  - Single `npm run build` command
  - Uploads .next/ build artifacts for deployment validation
- **Security Scan**: Vulnerability detection
  - npm audit for dependency vulnerabilities
  - Trivy security scanner focused on Next.js app
- **Deployment Check**: Validates production readiness (no actual deployment)
  - Downloads build artifacts
  - Tests that production server can start successfully
  - Validates build artifacts are complete and functional

## 📋 Setup Instructions

### 1. Enable GitHub Actions

✅ GitHub Actions are automatically enabled for this repository

### 2. Configure Secrets (Optional)

For enhanced features, add these secrets in **Repository Settings → Secrets**:

```text
CODECOV_TOKEN=your_codecov_token  # For coverage reporting
```

### 3. Production Deployment Options

The Next.js migration simplified deployment to a single application. Choose your preferred platform:

#### Option A: Vercel (Recommended for Next.js)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from Next.js directory
cd obsidian-parser-nextjs
vercel --prod
```

#### Option B: Netlify

```bash
# Install Netlify CLI  
npm install -g netlify-cli

# Build and deploy
cd obsidian-parser-nextjs
npm run build
netlify deploy --prod --dir=.next
```

#### Option C: Docker Deployment

```bash
# Build Docker image
cd obsidian-parser-nextjs
docker build -t campaign-parser .

# Run container
docker run -p 3000:3000 campaign-parser
```

#### Option D: Manual Server Deployment

```bash
# Build application
cd obsidian-parser-nextjs
npm run build

# Start production server
npm start
```

## 🧪 Local Testing

Before pushing, ensure everything works locally:

```bash
# Change to Next.js directory
cd obsidian-parser-nextjs

# Run all tests (93 tests)
npm test

# Run linting
npm run lint

# TypeScript check
npx tsc --noEmit

# Build application
npm run build

# Test coverage
npm test -- --coverage

# Test production build
npm start
```

## 📊 Monitoring & Quality Gates

### Coverage Requirements

- **Minimum Coverage**: 70% (branches, functions, lines, statements)
- **Current Status**: 93/93 tests passing with excellent coverage
- **Reports**: Generated in `coverage/` directory
- **Integration**: Uploaded to Codecov (if configured)

### Code Quality

- **ESLint**: Enforces TypeScript and React best practices with Next.js rules
- **TypeScript**: Strict compilation with no errors
- **Next.js Compiler**: React Compiler integration for automatic optimization
- **Security**: Automated vulnerability scanning with npm audit and Trivy

### Build Requirements

- **Next.js Build**: Must complete successfully
- **TypeScript**: Must compile without errors  
- **Tests**: All 93 tests must pass
- **Multiple Node Versions**: Tested on 18.x and 20.x
- **Production Validation**: Deployment check validates server starts correctly (testing only, no deployment)

### 🔄 Workflow Triggers

| Event | Branches | Actions |
|-------|----------|---------|
| Push | `main` | Test + Build + Security Scan + Deployment Check |
| Push | `develop` | Test + Build + Security Scan + Deployment Check |
| Push | `feat/nextjs-migration` | Test + Build + Security Scan + Deployment Check |
| Pull Request | → `main` | Test + Build + Security Scan + Coverage Report |

**Note:** All deployment is manual. The CI pipeline validates code quality, runs 93 tests, builds Next.js artifacts, performs security scanning, and validates production readiness (but does not deploy anywhere).

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

1. **E2E Testing**: Add Playwright for browser testing
2. **Performance Monitoring**: Add Lighthouse CI for performance tracking
3. **Docker**: Create Dockerfile for containerized deployment

## 🚀 Deployment Strategy - Next.js Migration Complete

All deployments are **completely manual** with Next.js simplification benefits:

### Infrastructure Improvements

- ✅ **Single Application**: No more client/server coordination
- ✅ **Single Build**: One `npm run build` replaces complex orchestration
- ✅ **Single Port**: No more proxy configuration needed
- ✅ **API Routes**: Built-in /api/health and /api/parse endpoints
- ✅ **93 Tests**: Comprehensive test coverage including deduplication system

### Deployment Benefits

- **Full control** over when and how you deploy
- **No accidental deployments** from commits  
- **Simplified deployment** - single Next.js application
- **Multiple platform options** - Vercel, Netlify, Docker, traditional hosting
- **CI validation** ensures production readiness before manual deployment

Your CI pipeline validates every commit with comprehensive testing (93 tests), Next.js building, security scanning, and production readiness validation. The migration is complete and ready for manual deployment! 🎉

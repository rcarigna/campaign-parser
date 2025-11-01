# Development Tools

This directory contains development and build tools for the obsidian-parser project.

## 🛠️ Available Tools

### `analyze-components.js`

Analyzes React component file sizes and complexity metrics.

**Usage:**

```bash
npm run analyze:components
```

**Features:**

- Reports component line counts and complexity
- Color-coded output with size categories
- Identifies components that need refactoring
- Counts hooks, functions, and JSX blocks
- Exits with error code for CI/CD integration

**Thresholds:**

- Small: ≤50 lines
- Medium: 51-100 lines  
- Large: 101-150 lines
- X-Large: 151+ lines (⚠️ consider refactoring)

## 📁 Directory Purpose

The `tools/` directory is for:

- ✅ Code analysis scripts
- ✅ Build automation utilities
- ✅ Development workflow helpers
- ✅ CI/CD integration scripts
- ✅ Quality assurance tools

**Not for:**

- ❌ Application source code
- ❌ Configuration files
- ❌ Documentation (use `docs/`)
- ❌ Test utilities

## 🚀 Adding New Tools

When adding new tools:

1. **Name clearly**: Use descriptive filenames (`analyze-bundle-size.js`, `check-deps.js`)
2. **Add npm script**: Add to `package.json` scripts section
3. **Document here**: Update this README
4. **Make executable**: Add shebang line for Node scripts
5. **Follow patterns**: Use same code style and error handling

## 📚 Integration

Tools are integrated into:

- **Package.json scripts**: `npm run analyze:components`
- **GitHub Actions**: `.github/workflows/code-quality.yml`
- **Pre-commit hooks**: `.git/hooks/pre-commit`
- **ESLint rules**: Additional automated checks

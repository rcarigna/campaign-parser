# Contributing to Campaign Document Parser

Welcome! We're excited that you're interested in contributing to the Campaign Document Parser. This guide will help you get started with contributing to our Next.js application for campaign entity extraction and management.

## 🚀 Getting Started

### Prerequisites

- **Node.js 18+** (20.x recommended)
- **npm**, yarn, or pnpm
- **Git** for version control
- **Basic TypeScript/React knowledge**

### Development Setup

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/campaign-parser.git
   cd campaign-parser
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Start development server**:

   ```bash
   npm run dev
   ```

5. **Run tests** to ensure everything works:

   ```bash
   npm test
   ```

## 📝 How to Contribute

### Types of Contributions

- **🐛 Bug Reports**: Found a bug? Report it!
- **✨ Feature Requests**: Have an idea? We'd love to hear it!
- **📚 Documentation**: Help improve our docs
- **🔧 Code Contributions**: Fix bugs or add features
- **🧪 Testing**: Add tests or improve test coverage

### Before You Start

1. **Check existing issues** to avoid duplicates
2. **Create an issue** for discussion (for large changes)
3. **Review our coding standards** below

## 🛠️ Development Process

### 1. Create a Feature Branch

```bash
# Create and checkout a new branch
git checkout -b feat/your-feature-name

# Or for bug fixes
git checkout -b fix/bug-description
```

### 2. Make Your Changes

Follow our coding standards (see below) and ensure:

- **TypeScript**: Use strict typing
- **Tests**: Add tests for new functionality
- **Documentation**: Update relevant docs
- **Linting**: Code passes ESLint checks

### 3. Test Your Changes

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Check linting
npm run lint

# Build application
npm run build
```

### 4. Commit Your Changes

We use **Conventional Commits**:

```bash
# Feature
git commit -m "feat: add entity duplicate detection"

# Bug fix  
git commit -m "fix: resolve entity merge modal state issue"

# Documentation
git commit -m "docs: update API documentation"

# Testing
git commit -m "test: add deduplication system tests"
```

### 5. Push and Create Pull Request

```bash
git push origin feat/your-feature-name
```

Then create a Pull Request on GitHub with:

- **Clear title** describing the change
- **Detailed description** of what and why
- **Screenshots** if UI changes
- **Testing notes** for reviewers

## 📋 Coding Standards

### TypeScript Guidelines

```typescript
// ✅ Good: Use strict typing
```typescript
type EntityProps = {
  entity: AnyEntity;
  onEdit: (entity: AnyEntity) => void;
  isSelected?: boolean;
}

// ❌ Avoid: Any types
const handleClick = (data: any) => { ... }

// ✅ Good: Proper error handling
try {
  const result = await parseDocument(file);
  return result.entities;
} catch (error) {
  console.error('Parse failed:', error);
  throw new Error(error instanceof Error ? error.message : 'Parse failed');
}
```

### React Component Guidelines

```tsx
// ✅ Good: Arrow function components
const EntityCard = ({ entity, onEdit, isSelected = false }: EntityProps) => {
  // Component logic here
  return (
    <div className="entity-card">
      {/* JSX content */}
    </div>
  );
};

// ✅ Good: Use React Compiler optimization (automatic memoization)
// No need for manual useMemo/useCallback

// ✅ Good: Proper prop destructuring
const { title, role, faction } = entity;
```

### Testing Guidelines

```typescript
// ✅ Good: Descriptive test names
describe('EntityMergeModal', () => {
  it('should merge entities and preserve all source sessions', () => {
    const duplicates = [entity1, entity2];
    const result = mergeEntities(duplicates);
    
    expect(result.sourceSessions).toEqual([1, 2, 3]);
    expect(result.title).toBe(entity1.title);
  });

  it('should display error toast when merge fails', async () => {
    const mockToast = jest.spyOn(toast, 'error');
    
    // Simulate merge failure
    mockMergeFunction.mockRejectedValueOnce(new Error('Merge failed'));
    
    await userEvent.click(screen.getByRole('button', { name: /merge/i }));
    
    expect(mockToast).toHaveBeenCalledWith('Failed to merge entities');
  });
});
```

### File Organization

```plaintext
src/
├── components/           # React components
│   ├── Entity/          # Entity-related components
│   │   ├── EntityCard/  # Individual component folders
│   │   │   ├── EntityCard.tsx
│   │   │   ├── EntityCard.test.tsx
│   │   │   └── index.ts
│   │   └── index.ts     # Barrel exports
├── hooks/               # Custom React hooks  
├── lib/                 # Utilities and services
└── types/               # TypeScript definitions
```

## 🧪 Testing Strategy

### Test Coverage Requirements

- **Minimum Coverage**: 70% (current: 77%+)
- **New Features**: Must include comprehensive tests
- **Bug Fixes**: Add regression tests

### Testing Best Practices

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test component interactions
3. **User Flow Tests**: Test complete user workflows
4. **Edge Case Testing**: Test error conditions and edge cases

### Running Tests

```bash
# Run all tests
npm test

# Watch mode for development
npm run test:watch

# Coverage report
npm run test:coverage

# Specific test file
npm test EntityCard.test.tsx
```

## 📚 Documentation Guidelines

### When to Update Docs

- **New Features**: Add usage examples and API docs
- **Bug Fixes**: Update any affected documentation  
- **Breaking Changes**: Clearly document migration steps
- **Configuration Changes**: Update setup guides

### Documentation Standards

- **Clear Headings**: Use descriptive section headers
- **Code Examples**: Include working code snippets
- **Screenshots**: Add for UI changes
- **Links**: Use relative links within repo

## 🔍 Code Review Process

### What We Look For

1. **Functionality**: Does it work as intended?
2. **Code Quality**: Clean, readable, maintainable?
3. **Testing**: Adequate test coverage?
4. **Performance**: No unnecessary performance impacts?
5. **Documentation**: Properly documented?

### Review Timeline

- **Initial Response**: Within 2 business days
- **Full Review**: Within 1 week
- **Feedback Cycles**: We aim for constructive, actionable feedback

## 🐛 Bug Reports

### Good Bug Reports Include

```markdown
## Bug Description
Clear description of what's wrong

## Steps to Reproduce
1. Upload a document with...
2. Click on entity...
3. Observe error...

## Expected Behavior
What should happen instead

## Environment
- OS: Windows 11
- Node: 20.x
- Browser: Chrome 119

## Additional Context
Screenshots, error logs, etc.
```

## ✨ Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature

## Use Case
Why is this feature needed? Who benefits?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've thought about

## Additional Context
Mockups, examples, related issues
```

## 📊 Current Project Status

- **Next.js 16**: Modern React with App Router
- **93 Tests**: Comprehensive test coverage
- **Production Ready**: Deployed and stable
- **Active Development**: Regular improvements

## 🤝 Community Guidelines

### Code of Conduct

- **Be Respectful**: Treat everyone with respect
- **Be Constructive**: Focus on improving the project
- **Be Inclusive**: Welcome contributors of all backgrounds
- **Be Patient**: Remember we're all learning

### Getting Help

- **Documentation**: Check docs first
- **GitHub Discussions**: Ask questions and share ideas
- **GitHub Issues**: Report bugs and request features
- **Code Review**: Learn from feedback

## 🎯 Priority Areas

We're especially interested in contributions for:

1. **Entity Extraction**: Improve NLP accuracy
2. **Performance**: Optimize large document processing
3. **Testing**: Increase test coverage
4. **Documentation**: Improve user guides
5. **Accessibility**: Better screen reader support
6. **Integration**: Connect with other campaign tools

## 📞 Contact

- **GitHub Issues**: Primary communication channel
- **GitHub Discussions**: Community questions and ideas
- **Pull Requests**: Code contributions and reviews

Thank you for contributing to Campaign Document Parser! Your help makes this project better for the entire campaign management community. 🎲✨

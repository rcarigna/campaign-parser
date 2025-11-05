# 📋 Campaign Document Parser

**A powerful Next.js application for parsing and managing campaign documents with intelligent entity extraction and deduplication.**

Transform your campaign notes, session summaries, and world-building documents into organized, searchable entity databases with advanced NLP and smart duplicate management.

---

## 🌟 Features

### 📄 Document Processing

- **Multi-format Support**: Upload Word documents (.docx) or Markdown files (.md)
- **Frontmatter Parsing**: Automatic YAML frontmatter extraction and processing  
- **Smart Content Extraction**: Headings, links, images, and structured content parsing
- **Real-time Processing**: Instant feedback with upload progress and error handling

### 🎭 Entity Management

- **Intelligent Extraction**: Dual-layer entity detection using NLP + regex patterns
- **Campaign Entities**: NPCs, Locations, Items, Factions, Events, and more
- **Interactive Management**: View, edit, filter, and organize extracted entities
- **Smart Deduplication**: Advanced duplicate detection with merge workflow

### 🔄 Deduplication System

- **Duplicate Detection**: Automatic identification of similar entities across documents
- **Merge Interface**: Visual comparison and field-by-field merging
- **Preview Mode**: See merged results before confirming changes
- **Bulk Operations**: Efficient handling of multiple duplicates

### 🔍 Advanced Filtering

- **Entity Types**: Filter by NPCs, Locations, Items, Factions, Events
- **Search**: Real-time text search across all entity fields
- **Importance Levels**: Major, minor, background entity classification
- **Selection Tools**: Multi-select for bulk operations

### 📤 Obsidian Export

- **Template System**: Handlebars-based templates for each entity type
- **Vault Structure**: Organized export matching Obsidian folder conventions
- **Markdown Format**: Full frontmatter, tags, and wiki-link compatibility
- **Batch Export**: ZIP download with complete campaign data structure

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ (20.x recommended)
- npm, yarn, or pnpm

### Development Setup

```bash
# Clone the repository
git clone https://github.com/rcarigna/campaign-parser.git
cd campaign-parser

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the application.

### Production Build

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🏗️ Architecture

### Modern Next.js Stack

- **Next.js 16**: App Router with React Server Components
- **React Compiler**: Automatic optimization for complex entity operations
- **TypeScript**: Full type safety across client and server
- **Tailwind CSS**: Responsive, modern UI design

### API Routes

- **`/api/health`**: System health check endpoint
- **`/api/parse`**: Document processing and entity extraction
- **`/api/export`**: Obsidian-formatted entity export with ZIP generation

### File Structure

```plaintext
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (replaces Express server)
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application
├── components/            # React components
│   ├── Document/          # File upload & parsing UI
│   ├── Entity/            # Entity management & deduplication
│   └── Layout/            # Application layout
├── hooks/                 # Custom React hooks
├── lib/                   # Server-side utilities
│   ├── export/            # Obsidian export system
│   │   ├── templates/     # Handlebars templates for entities
│   │   └── obsidian_vault_tree.txt # Target vault structure
│   └── services/          # Document parsing & entity extraction
└── types/                 # TypeScript definitions

__mocks__/                 # Test fixtures and example data
├── session_summary_*.json # Campaign session data examples
└── session_summary_*.md   # Parsed document examples
```

---

## 🧪 Testing

Comprehensive test suite with 93 tests covering all functionality:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

**Test Coverage**:

- Statements: 77.58%
- Lines: 79.15%
- Functions: 72.61%
- Branches: 66.45%

### Test Categories

- **Component Tests**: UI components with user interactions
- **Hook Tests**: Custom React hooks with mock integrations
- **API Tests**: Next.js API routes with request/response validation
- **Service Tests**: Document parsing and entity extraction accuracy

---

## 📖 Documentation

Our comprehensive documentation covers every aspect of the system:

### 📚 Core Documentation

- **[📋 Architecture Overview](docs/architecture.md)** - Technical system design, stack details, and mermaid diagrams
- **[🧠 Entity Extraction](docs/entity-extraction.md)** - Dual-engine NLP and regex processing system
- **[🔀 Deduplication Guide](docs/deduplication-guide.md)** - Complete merge workflow and UI component guide
- **[🔌 API Reference](docs/api-reference)** - Full REST API documentation with examples
- **[🗺️ Project Roadmap](docs/ROADMAP)** - Feature roadmap and development priorities
- **[🤝 Contributing Guidelines](CONTRIBUTING)** - Development setup, coding standards, and community guidelines

### 🎯 GitHub Integration

- **[🐛 Bug Reports](.github/ISSUE_TEMPLATE/bug_report.yml)** - Structured issue templates
- **[✨ Feature Requests](.github/ISSUE_TEMPLATE/feature_request.yml)** - Enhancement proposals
- **[💬 Discussions](https://github.com/YOUR_USERNAME/obsidian-parser/discussions)** - Community questions and ideas
- **[📋 Pull Request Template](.github/pull_request_template.md)** - Standardized contribution process

---

## 📖 Usage Guide

### 1. Upload Documents

- Drag & drop or click to upload Word/Markdown files
- Supported formats: `.docx`, `.md`
- File size limit: 10MB per file
- Real-time validation and progress feedback

### 2. Review Extracted Entities  

- Automatically extracted NPCs, locations, items, and more
- Filter by entity type and importance level
- Search across all entity fields
- Edit individual entities with form validation

### 3. Manage Duplicates

- Review entities marked as potential duplicates
- Select primary entity and merge fields from duplicates
- Preview merged results before confirming
- Toast notifications for user feedback

### 4. Export & Integration

- **Obsidian Export**: Generate vault-ready markdown files with proper frontmatter
- **Template System**: Customizable Handlebars templates for each entity type
- **ZIP Download**: Complete campaign export in organized folder structure
- **Clean Data**: Deduplicated entity database ready for campaign management

---

## 🔧 Configuration

### Environment Variables

Create `.env.local` for development:

```bash
# Add any environment-specific configuration here
# Currently no required environment variables
```

### File Upload Limits

Configure in `next.config.ts`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
```

---

## 🛠️ Development

### Code Quality

- **ESLint**: Comprehensive linting rules
- **TypeScript**: Strict type checking
- **Jest**: Unit and integration testing
- **React Testing Library**: Component testing best practices

### Available Scripts

```bash
npm run dev          # Development server
npm run build        # Production build  
npm run start        # Production server
npm run lint         # Code linting
npm test             # Run test suite
npm run test:watch   # Watch mode testing
npm run test:coverage # Coverage report
```

### Hot Reload

- **Frontend**: Instant React component updates
- **Backend**: API route changes reload automatically
- **Types**: TypeScript changes update across app

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Production Build

```bash
npm run build
npm start
```

### Docker (Optional)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

---

## 📊 Performance

### Benchmarks

- **Cold Start**: < 5 seconds
- **File Upload**: < 2 seconds for typical campaign documents
- **Entity Extraction**: ~500ms for 10-page documents
- **UI Responsiveness**: 60 FPS with React Compiler optimization

### Optimization Features

- **React Compiler**: Automatic memoization for entity operations
- **Next.js Optimization**: Built-in code splitting and asset optimization
- **Efficient Algorithms**: Smart duplicate detection with minimal false positives

---

## 🤝 Contributing

### Getting Started

1. Fork the repository
2. Create feature branch: `git checkout -b feat/amazing-feature`
3. Run tests: `npm test`
4. Commit changes: `git commit -m 'Add amazing feature'`
5. Push to branch: `git push origin feat/amazing-feature`
6. Open Pull Request

### Code Standards

- Follow TypeScript strict mode
- Write tests for new features
- Maintain >70% test coverage
- Use conventional commit messages

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Next.js Team**: For the incredible framework
- **Compromise.js**: Natural language processing library
- **Mammoth.js**: Word document parsing
- **React Testing Library**: Testing utilities

---

## 📧 Support

- **Issues**: [GitHub Issues](https://github.com/rcarigna/campaign-parser/issues)
- **Discussions**: [GitHub Discussions](https://github.com/rcarigna/campaign-parser/discussions)

---

*Built with ❤️ for campaign managers, world builders, and storytellers everywhere.*

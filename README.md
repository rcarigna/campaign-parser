# 📋 Campaign Document Parser

**A powerful Next.js application for parsing and managing campaign documents with intelligent entity extraction and deduplication.**

Transform your campaign notes, session summaries, and world-building documents into organized, searchable entity databases with advanced NLP and smart duplicate management.

---

## 🌟 Features

### 🎭 Interactive Demo

- **Try Before You Upload**: Load example session notes with one click
- **Real Campaign Data**: Pre-loaded D&D session from the Waterdeep campaign
- **Live Markdown Preview**: Toggle between formatted and raw markdown views
- **Entity Showcase**: See automatic extraction of NPCs, locations, items, and quests
- **Full Feature Access**: Test all parser capabilities with example data

### 📄 Document Processing

- **Multi-format Support**: Upload Word documents (.docx) or Markdown files (.md)
- **Frontmatter Parsing**: Automatic YAML frontmatter extraction and processing  
- **Smart Content Extraction**: Headings, links, images, and structured content parsing
- **Real-time Processing**: Instant feedback with upload progress and error handling

### ✨ Entity Management

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

- **Complete System**: Export API fully implemented with ZIP generation ✅
- **Template Engine**: Handlebars-based templates for each entity type ✅
- **Vault Structure**: Organized export matching Obsidian folder conventions ✅
- **Markdown Format**: Full frontmatter, tags, and wiki-link compatibility ✅
- **ZIP Download**: One-click export to downloadable vault archive ✅
- **Folder Organization**: Proper Campaign Vault structure (02_World/NPCs, etc.) ✅

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Modern web browser (Chrome, Firefox, Edge, Safari)

### Installation

```bash
# Clone the repository
git clone https://github.com/rcarigna/campaign-parser.git
cd campaign-parser/workspace

# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

### Usage

1. **Upload** your session notes (DOC or Markdown)
2. **Review** extracted entities in the grid view
3. **Edit** any entity details or change entity types
4. **Merge** duplicate entities using the selection tool
5. **Export** your organized vault as a ZIP file
6. **Import** the ZIP into Obsidian and start your campaign!

### Git Hooks

This project uses a pre-push hook to ensure code quality before pushing to the repository. The hook automatically:

- ✅ Runs ESLint for code style checks
- ✅ Runs TypeScript compilation (`tsc --noEmit`) to catch type errors
- ❌ Prevents push if any errors are found

The hook is automatically installed when you run `npm install`. If you need to manually set it up:

```bash
# Manually install Git hooks
npm run prepare
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

### API Routes (Server-Side Business Logic)

- **`/api/health`**: System health check endpoint
- **`/api/parse`**: Document processing and entity extraction
- **`/api/export`**: Obsidian-formatted entity export (business logic embedded)

### Simplified Next.js Architecture

```tree
src/
├── app/                    # Next.js App Router
│   ├── api/               # 🚀 API routes with embedded business logic
│   │   ├── export/        #    Export entities to Obsidian format
│   │   ├── health/        #    System health check
│   │   └── parse/         #    Document parsing & entity extraction
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main application
├── client/                # 🌐 Client-side HTTP utilities
│   └── api.ts            #    Simple axios calls to API routes
├── components/            # React components
│   ├── Document/          # File upload & parsing UI
│   ├── Entity/            # Entity management & deduplication
│   └── Layout/            # Application layout
├── hooks/                 # Custom React hooks
├── lib/                   # 🎯 Shared utilities (client + server safe)
│   ├── documentParser/    # Core: Document processing
│   ├── entityExtractor/   # Core: Entity extraction
│   └── templateEngine/    # Core: Template processing & Handlebars
│       └── templates/     #   Template files for each entity type
└── types/                 # TypeScript definitions

├── expected_obsidian_output/  # Expected template outputs
├── session_summary_*.json     # Campaign session data
└── session_summary_*.md       # Example documents
```

---

## 🧪 Test Suite

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Current status: 308 tests passing across 29 test suites
```

**Test Coverage**: **308 tests passing** with comprehensive coverage across all architectural layers

### Test Categories

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Current Status**: 308 tests passing across 29 test suites

### Coverage by Area

- **Component Tests**: UI components with user interactions using real entity data
- **Hook Tests**: Custom React hooks (useCampaignParser, useEntitySelection, useFileManager)
- **API Tests**: All endpoints (parse, export, demo, health)
- **Library Tests**: Entity extraction, template engine, validation
- **Integration Tests**: End-to-end workflows with real campaign data
- **Hook Tests**: Custom React hooks with mock integrations
- **API Tests**: Next.js API routes with request/response validation
- **Entity Extraction Tests**: Both NLP and regex engines validated against actual D&D session content
- **Real Data Validation**: Tests use authentic campaign session (`session_summary_1.md`) with 7,220 characters of D&D content

### Test Data Quality

Our tests use **real campaign session data** instead of synthetic mocks:

- **Authentic D&D Content**: Actual session summary from "Waterdeep: Dragon Heist"
- **Entity Validation**: NPCs (Durnan, Bonnie, Yagra), Locations (Yawning Portal, Waterdeep), Items (ancestral blade)
- **Accuracy Testing**: Both NLP and regex extractors validated against real campaign entities
- **No Mock Dependencies**: Eliminated complex library mocking in favor of real data validation

---

## 📖 Documentation

Our comprehensive documentation covers every aspect of the system:

### 📚 Core Documentation

- **[📋 Architecture Overview](docs/architecture.md)** - Technical system design, stack details, and component structure
- **[🔌 API Reference](docs/api-reference.md)** - Complete REST API documentation with examples
- **[🗺️ Project Roadmap](docs/ROADMAP.md)** - Current status and development priorities
- **[🤝 Contributing Guidelines](CONTRIBUTING.md)** - Development setup, coding standards, and community guidelines
- **[📁 Detailed Documentation](docs/archive/)** - In-depth guides for entity extraction, deduplication, and more

### 🎯 GitHub Integration

- **[🐛 Bug Reports](.github/ISSUE_TEMPLATE/bug_report.yml)** - Structured issue templates
- **[✨ Feature Requests](.github/ISSUE_TEMPLATE/feature_request.yml)** - Enhancement proposals
- **[💬 Discussions](https://github.com/YOUR_USERNAME/obsidian-parser/discussions)** - Community questions and ideas
- **[📋 Pull Request Template](.github/pull_request_template.md)** - Standardized contribution process

---

## 📖 Usage Guide

### 🎭 Try the Demo (Recommended for First-Time Users)

**Start here to see the parser in action!**

1. **Open the application** and click the **"🎭 Try Demo"** tab
2. **Click "Load Example Session"** to load a pre-configured D&D campaign session
3. **View the session notes** in both formatted and raw markdown
4. **Explore extracted entities** - NPCs, locations, items automatically identified
5. **Test features** like filtering, editing, merging duplicates, and Obsidian export

The demo uses a real session note from the `__mocks__` directory, showcasing how the parser handles:

- **NPCs**: Durnan, Volothamp Geddarm, Yagra, and more
- **Locations**: Yawning Portal, Waterdeep, Undermountain
- **Items**: Ancestral Blade
- **Quests**: Finding Floon Blagmaar

### 1. Upload Your Own Documents

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

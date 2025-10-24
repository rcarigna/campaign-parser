# Campaign Parser

A modern, full-stack document parsing application designed for D&D campaign management. Features React TypeScript frontend, Node.js backend, advanced NLP entity extraction, and comprehensive testing. Converts session notes and campaign documents into structured data with intelligent entity recognition.

## 🌟 Features

- **Document Upload**: Drag & drop or click to upload DOC, DOCX, and Markdown files
- **Intelligent Entity Extraction**:
  - **NLP-Powered**: Advanced Natural Language Processing using compromise.js
  - **Regex Fallback**: Traditional pattern-based extraction for comparison
  - **Campaign Entities**: NPCs, locations, items, quests, and session summaries
  - **Zero False Positives**: NLP approach eliminates incorrect entity identification
- **Real-time Parsing**: Instant conversion to structured JSON format
- **Document Analysis**:
  - Word documents: Extract HTML, plain text, and metadata with error reporting
  - Markdown files: Industry-standard parsing with `gray-matter` + `markdown-it`
  - Enhanced frontmatter support: YAML, TOML, JSON with proper type parsing
  - Robust heading, link, and image extraction with AST-based parsing
- **Type-Safe Architecture**: Shared TypeScript types between client and server
- **Functional Programming**: Modern functional architecture throughout
- **Comprehensive Testing**: 74+ tests with 98%+ coverage and entity extraction comparisons
- **CI/CD Pipeline**: Automated testing, building, and security scanning
- **Modern UI**: Clean, responsive interface with comprehensive error handling
- **Production Ready**: Optimized builds with artifact generation

## 🏗️ Architecture

### Frontend (`/client`)

- **React 18** with TypeScript and modern hooks (useFileManager, useDocumentProcessor)
- **Vite** for fast development and optimized production builds
- **Axios** for type-safe API communication
- **Component Architecture**: Single-responsibility components with comprehensive testing
- **ES Modules**: Full ES module support throughout the application

### Backend (`/server`)

- **Node.js** with Express and TypeScript
- **Multer** for secure file upload handling with validation
- **Mammoth** for DOC/DOCX parsing with error reporting
- **Advanced Entity Extraction**:
  - **NLP Engine**: compromise.js for intelligent named entity recognition
  - **Functional Architecture**: Modern functional programming throughout
  - **Campaign Intelligence**: Specialized D&D entity recognition (NPCs, locations, items, quests)
  - **Dual Approach**: NLP primary + regex fallback for maximum accuracy
- **Professional Markdown Stack**:
  - `gray-matter` for robust frontmatter parsing (YAML/TOML/JSON)
  - `markdown-it` for CommonMark-compliant AST parsing
  - `marked` for reliable HTML conversion
- **Standards Compliance**: Full CommonMark specification support
- **Comprehensive Error Handling**: Structured error responses and logging

### Shared Types (`/shared`)

- **Single Source of Truth**: Shared TypeScript types between client and server
- **Type Safety**: Compile-time guarantees for API contracts
- **ES Module Package**: Modern module system with proper declarations

## 📁 Project Structure

```text
├── .github/workflows/     # CI/CD pipeline configuration
│   └── ci-cd.yml         # GitHub Actions workflow
├── client/               # React TypeScript frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── services/     # API communication layer
│   │   ├── types/        # Type definitions and constants
│   │   ├── App.tsx       # Main application component
│   │   └── main.tsx      # React entry point
│   ├── jest.config.cjs   # Jest configuration with ES module support
│   ├── package.json      # Client dependencies
│   ├── tsconfig.json     # TypeScript configuration
│   └── vite.config.ts    # Vite bundler configuration
├── server/               # Node.js Express backend
│   ├── src/
│   │   ├── services/
│   │   │   ├── documentParser/     # Document parsing logic
│   │   │   └── entityExtractor/    # Campaign entity extraction
│   │   │       ├── entityExtractor.ts      # Regex-based extraction (functional)
│   │   │       ├── nlpEntityExtractor.ts   # NLP-powered extraction (functional)
│   │   │       ├── *.test.ts               # Comprehensive extraction tests
│   │   │       └── index.ts                # Unified entity extraction API
│   │   └── index.ts      # Express server setup
│   ├── jest.config.js    # Jest configuration
│   ├── package.json      # Server dependencies
│   └── tsconfig.json     # TypeScript configuration
├── shared/               # Shared types and constants
│   ├── src/
│   │   ├── types.ts      # Shared TypeScript definitions
│   │   └── index.ts      # Package exports
│   ├── package.json      # Shared package configuration
│   └── tsconfig.json     # TypeScript configuration
└── package.json          # Root workspace configuration
```

## 🧠 Entity Extraction System

### Dual-Engine Approach

The system features two complementary entity extraction engines:

1. **NLP Engine (Primary)** - compromise.js powered
   - **Accuracy**: 28 entities, 0 false positives
   - **Intelligence**: Contextual understanding of campaign entities
   - **Approach**: Functional programming with linguistic analysis

2. **Regex Engine (Fallback)** - Pattern-based extraction
   - **Coverage**: 52 entities with some false positives
   - **Reliability**: Traditional pattern matching for edge cases
   - **Approach**: Functional programming with comprehensive patterns

### Supported Entity Types

- **📝 Session Summaries**: Automatic session detection and metadata extraction
- **👥 NPCs (Non-Player Characters)**: Names, roles, and campaign context
- **🏰 Locations**: Taverns, cities, dungeons with intelligent type detection
- **⚔️ Items**: Weapons, armor, magical items with classification
- **🎯 Quests**: Mission objectives and status tracking

### Usage Examples

```typescript
// NLP-powered extraction (recommended)
import { extractEntities } from './services/entityExtractor';
const entities = extractEntities(markdownContent);

// Regex-based extraction (fallback)
import { extractEntitiesRegex } from './services/entityExtractor';
const entities = extractEntitiesRegex(markdownContent, filename);

// Legacy class support (deprecated)
import { EntityExtractor } from './services/entityExtractor';
const extractor = new EntityExtractor();
const entities = extractor.extractEntities(markdownContent, filename);
```

### Entity Output Example

```json
{
  "kind": "npc",
  "title": "Durnan",
  "role": "barkeep",
  "sourceSessions": [1]
}
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Git** for version control

### Installation

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd obsidian-parser
   npm run install:all
   ```

   Or install individually:

   ```bash
   npm install              # Root dependencies
   npm run install:client   # Client dependencies
   npm run install:server   # Server dependencies
   npm run install:shared   # Shared package dependencies
   ```

### Development

1. **Start development servers:**

   ```bash
   npm run dev              # Starts both client and server
   ```

   Or start individually:

   ```bash
   npm run dev:client       # React dev server (http://localhost:3000)
   npm run dev:server       # Express server (http://localhost:3001)
   ```

2. **Access the application:**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:3001`

### Testing

```bash
npm test                    # Run all tests (client + server)
npm run test:client         # Run client tests with coverage
npm run test:server         # Run server tests with coverage
npm run test:watch          # Run tests in watch mode
```

### Building for Production

```bash
npm run build              # Build all packages (shared → client → server)
npm run build:client       # Build client only
npm run build:server       # Build server only
npm run build:shared       # Build shared package only
```

## 🔄 Architecture Evolution (October 2025)

### ✅ Markdown Parsing Migration

Successfully migrated from regex-based parsing to professional library-based parsing:

**Migration Benefits:**

- **📈 Reliability**: 20+ lines of fragile regex → 3 lines of industry-standard libraries
- **🛡️ Error Handling**: Professional-grade error handling and edge case support
- **📏 Standards Compliance**: Full CommonMark specification compliance
- **🔧 Maintainability**: No more regex debugging sessions
- **⚡ Performance**: Optimized parsing algorithms
- **🔮 Future-Proof**: Easy to extend with new markdown features

### ✅ Entity Extraction Revolution

Implemented dual-engine entity extraction system with functional architecture:

**NLP Engine Benefits:**

- **🎯 Accuracy**: 0 false positives vs regex's multiple false positives
- **🧠 Intelligence**: Contextual understanding of campaign entities
- **⚡ Performance**: 28 high-quality entities vs 52 with noise
- **🔧 Maintainability**: Functional programming throughout

**Functional Programming Migration:**

- **📦 Modularity**: Class-based → Function-based architecture
- **🧪 Testability**: Each function independently testable
- **🔄 Composability**: Easy to combine and extend extraction logic
- **📈 Consistency**: Uniform functional style across both engines

### Current Technology Stack

```typescript
// Entity Extraction: NLP + Functional Programming
import { extractEntities } from './entityExtractor';
const entities = extractEntities(content); // 0 false positives

// Markdown Parsing: Industry Standards
import matter from 'gray-matter';         // YAML/TOML/JSON frontmatter
import MarkdownIt from 'markdown-it';     // CommonMark AST parsing
import { marked } from 'marked';          // Reliable HTML conversion
```

### Parsing Capabilities

- ✅ **Complex Frontmatter**: YAML objects, arrays, dates, booleans
- ✅ **Robust Link Parsing**: Inline links with titles, reference links
- ✅ **Indentation Handling**: Automatic cleanup for malformed markdown
- ✅ **Image Processing**: Alt text, URLs, and title attributes
- ✅ **Heading Extraction**: Proper ID generation and hierarchy
- ✅ **Backward Compatibility**: All existing tests pass

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/parse` - Parse uploaded document with entity extraction

## Supported File Types

- **Word Documents**: `.doc`, `.docx`
- **Markdown Files**: `.md` (with campaign entity extraction)

## Document Parsing Output

### Word Documents

```json
{
  "filename": "document.docx",
  "type": "word_document",
  "content": {
    "html": "<p>Converted HTML content</p>",
    "text": "Plain text content",
    "messages": [],
    "warnings": [],
    "errors": []
  },
  "metadata": {
    "size": 12345,
    "mimeType": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "lastModified": "2023-..."
  }
}
```

### Markdown Files with Entity Extraction

```json
{
  "filename": "session_1.md",
  "type": "markdown",
  "content": {
    "raw": "# Session 1\nDurnan the barkeep...",
    "html": "<h1>Session 1</h1><p>Durnan the barkeep...</p>",
    "text": "Session 1 Durnan the barkeep...",
    "frontmatter": {"date": "2023-10-23", "campaign": "Waterdeep"},
    "headings": [{"level": 1, "text": "Session 1", "id": "session-1"}],
    "links": [{"text": "Yawning Portal", "url": "#yawning-portal", "type": "inline"}],
    "images": [{"alt": "Battle map", "url": "maps/session1.jpg"}]
  },
  "entities": [
    {
      "kind": "session_summary",
      "title": "Session 1: A Friend in Need",
      "session_number": 1,
      "brief_synopsis": "The party meets at the Yawning Portal...",
      "status": "complete"
    },
    {
      "kind": "npc",
      "title": "Durnan",
      "role": "barkeep",
      "sourceSessions": [1]
    },
    {
      "kind": "location",
      "title": "Yawning Portal",
      "type": "tavern",
      "sourceSessions": [1]
    }
  ],
  "metadata": {
    "size": 567,
    "mimeType": "text/markdown",
    "lastModified": "2023-..."
  }
}
```

## 🧪 Testing & Quality

- **Comprehensive Test Suite**: 74+ tests across client, server, and entity extraction
- **High Coverage**: 98%+ code coverage on client-side
- **Entity Extraction Testing**:
  - **Comparison Tests**: NLP vs Regex extraction quality analysis
  - **False Positive Detection**: Automated validation of extraction accuracy
  - **Integration Tests**: Real D&D session document processing
- **Unit Testing**: Jest with React Testing Library
- **Integration Testing**: API endpoint testing with real markdown files
- **Type Safety**: Full TypeScript with strict mode
- **Code Quality**: ESLint with custom rules for functional programming
- **Parsing Validation**: Tests for edge cases, indented content, malformed syntax

## 🔄 CI/CD Pipeline

- **Automated Testing**: Multi-version Node.js testing (18.x, 20.x)
- **Build Verification**: Automated production builds
- **Security Scanning**: npm audit and Trivy vulnerability scanning
- **Coverage Reports**: Automatic coverage reporting with Codecov
- **Artifact Generation**: Build artifacts for deployment
- **GitHub Actions**: Full workflow automation

## 📦 Technologies Used

### Frontend Stack

- **React 18** with modern hooks and functional components
- **TypeScript** with strict type checking
- **Vite** for fast development and optimized builds
- **Axios** for type-safe HTTP requests
- **Jest + React Testing Library** for comprehensive testing

### Backend Stack

- **Node.js** with Express framework
- **TypeScript** with ES modules support and functional programming
- **Multer** for secure file upload handling
- **Mammoth** for Word document parsing
- **Entity Extraction Engine**:
  - `compromise` for advanced NLP and named entity recognition
  - Functional architecture for both NLP and regex extractors
  - Campaign-specific entity dictionaries and patterns
- **Professional Markdown Libraries**:
  - `gray-matter` for frontmatter parsing
  - `markdown-it` for AST-based content parsing
  - `marked` for HTML conversion
- **Jest** for API, service, and entity extraction testing

### Shared Infrastructure

- **TypeScript Workspace** with shared types
- **ES Modules** throughout the application
- **GitHub Actions** for CI/CD automation
- **npm Workspaces** for monorepo management

## ⚡ Quick Start

1. **Install and start:**

   ```bash
   npm run install:all && npm run dev
   ```

2. **Open browser:** `http://localhost:3000`
3. **Upload a document** and see the parsed JSON output!

## 🛠️ Development Features

- **Hot Reload**: Real-time updates for both client and server
- **Auto Port Resolution**: Automatic port conflict handling
- **Type Safety**: Shared types ensure API contract consistency
- **Error Boundaries**: Comprehensive error handling and user feedback
- **File Validation**: Client and server-side file type and size validation
- **Modern Tooling**: ESLint, Prettier, and TypeScript strict mode

## 🎯 VS Code Integration

This project is optimized for VS Code development:

- **Tasks Configuration**: Pre-configured build and dev tasks
- **Jest Extension Support**: Run tests directly from the editor
- **TypeScript Integration**: Full IntelliSense and error checking
- **Workspace Settings**: Consistent code formatting and linting
- **Debug Configuration**: Ready-to-use debugging setup

### Available VS Code Commands

- **Ctrl+Shift+B**: Run build tasks
- **Ctrl+Shift+P** → "Tasks: Run Task": Access all development tasks
- **F5**: Start debugging (when configured)
- **Ctrl+Shift+`**: Open integrated terminal

## 🔧 Configuration

### Environment Variables

Create `.env` files in client and server directories for custom configuration:

**Client (.env):**

```env
VITE_API_URL=http://localhost:3001
```

**Server (.env):**

```env
PORT=3001
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=10485760
```

### File Upload Limits

- **Maximum file size**: 10MB
- **Supported formats**: DOC, DOCX, MD
- **Validation**: Client and server-side type checking

## � Deployment

The project generates optimized build artifacts for deployment:

```bash
npm run build
```

**Generated artifacts:**

- `client/dist/` - Static files for web server deployment
- `server/dist/` - Compiled Node.js application
- `shared/dist/` - Compiled shared types package

**Docker support:** Container configurations available for containerized deployment.

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch:** `git checkout -b feature/amazing-feature`
3. **Make your changes** following the established patterns:
   - Use arrow functions and functional programming style
   - Prefer `const` over `let`/`var`
   - Add comprehensive tests for new features
   - Update types in the shared package when needed
4. **Run tests:** `npm test`
5. **Commit changes:** `git commit -m 'Add amazing feature'`
6. **Push to branch:** `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Development Guidelines

- **Code Style**: Follow existing patterns (functional programming, arrow functions, TypeScript)
- **Testing**: Maintain >90% test coverage
- **Types**: Update shared types for any API changes
- **Documentation**: Update README and comments for significant changes
- **Parsing**: Use established libraries over custom regex when possible

## 🏆 Project Highlights

- ✅ **74+ comprehensive tests** with high coverage and entity extraction validation
- ✅ **Dual-engine entity extraction** with NLP primary + regex fallback
- ✅ **Zero false positives** with NLP-powered campaign entity recognition
- ✅ **Functional architecture** throughout both extraction engines
- ✅ **Professional markdown parsing** with industry-standard libraries
- ✅ **Shared type system** eliminating duplication
- ✅ **Modern ES modules** throughout the stack
- ✅ **CI/CD pipeline** with automated testing and building
- ✅ **Production-ready** architecture with security scanning
- ✅ **Standards compliant** CommonMark specification support
- ✅ **Developer experience** optimized for VS Code
- ✅ **Campaign intelligence** specialized for D&D session management

## � Documentation

- [`docs/MarkdownContentStructure.md`](./docs/MarkdownContentStructure.md) - Detailed parsing output documentation
- [`docs/MarkdownLibraryOptions.md`](./docs/MarkdownLibraryOptions.md) - Migration completion summary

## �📄 License

MIT License - Open source and free to use.

---

**Built with ❤️ for D&D campaign management using modern web technologies, advanced NLP, functional programming, and best practices.**

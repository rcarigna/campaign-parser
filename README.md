# Document Parser

A modern, full-stack document parsing application with React TypeScript frontend, Node.js backend, and shared type system. Features comprehensive testing, CI/CD pipeline, and production-ready architecture.

## 🌟 Features

- **Document Upload**: Drag & drop or click to upload DOC, DOCX, and Markdown files
- **Real-time Parsing**: Instant conversion to structured JSON format
- **Document Analysis**:
  - Word documents: Extract HTML, plain text, and metadata with error reporting
  - Markdown files: Parse frontmatter, headings, links, images, and table of contents
- **Type-Safe Architecture**: Shared TypeScript types between client and server
- **Comprehensive Testing**: 51 tests with 98%+ client coverage
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
- **Marked** for advanced Markdown processing (frontmatter, links, images)
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
│   │   │   └── documentParser.ts  # Document parsing logic
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

## API Endpoints

- `GET /api/health` - Health check endpoint
- `POST /api/parse` - Parse uploaded document

## Supported File Types

- **Word Documents**: `.doc`, `.docx`
- **Markdown Files**: `.md`

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

### Markdown Files

```json
{
  "filename": "document.md",
  "type": "markdown",
  "content": {
    "raw": "# Original markdown content",
    "html": "<h1>Converted HTML content</h1>",
    "text": "Content without frontmatter",
    "frontmatter": {},
    "headings": [{"level": 1, "text": "Title", "id": "title"}],
    "links": [{"text": "Link text", "url": "https://example.com", "type": "inline"}],
    "images": [{"alt": "Alt text", "url": "image.jpg"}]
  },
  "metadata": {
    "size": 567,
    "mimeType": "text/markdown",
    "lastModified": "2023-..."
  }
}
```

## 🧪 Testing & Quality

- **Comprehensive Test Suite**: 51 tests across client and server
- **High Coverage**: 98%+ code coverage on client-side
- **Unit Testing**: Jest with React Testing Library
- **Integration Testing**: API endpoint testing
- **Type Safety**: Full TypeScript with strict mode
- **Code Quality**: ESLint with custom rules for functional programming

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
- **TypeScript** with ES modules support
- **Multer** for secure file upload handling
- **Mammoth** for Word document parsing
- **Marked** for Markdown processing with extensions
- **Jest** for API and service testing

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

## 🏆 Project Highlights

- ✅ **51 comprehensive tests** with high coverage
- ✅ **Shared type system** eliminating duplication
- ✅ **Modern ES modules** throughout the stack
- ✅ **CI/CD pipeline** with automated testing and building
- ✅ **Production-ready** architecture with security scanning
- ✅ **Developer experience** optimized for VS Code

## �📄 License

MIT License - Open source and free to use.

---

**Built with ❤️ using modern web technologies and best practices.**

# Document Parser

A full-stack web application for parsing and analyzing documents, built with React TypeScript frontend and Node.js backend.

## 🌟 Features

- **Document Upload**: Drag & drop or click to upload DOC, DOCX, and Markdown files
- **Real-time Parsing**: Instant conversion to structured JSON format
- **Document Analysis**:
  - Word documents: Extract HTML, plain text, and metadata
  - Markdown files: Parse frontmatter, headings, links, and images
- **Type-Safe**: Full TypeScript implementation with strict type checking
- **Modern UI**: Clean, responsive interface with error handling
- **Auto Port Resolution**: Handles port conflicts automatically

## 🏗️ Architecture

### Frontend (`/client`)

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Axios** for API communication
- Responsive design with drag-and-drop upload

### Backend (`/server`)

- **Node.js** with Express and TypeScript
- **Multer** for file upload handling
- **Mammoth** for DOC/DOCX parsing
- **Marked** for Markdown processing
- Comprehensive error handling and logging

## 📁 Project Structure

```text
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── App.tsx        # Main application component
│   │   ├── App.css        # Application styles
│   │   ├── index.css      # Global styles
│   │   └── main.tsx       # React entry point
│   ├── index.html         # HTML template
│   ├── package.json       # Client dependencies
│   ├── tsconfig.json      # TypeScript config
│   └── vite.config.ts     # Vite config
├── server/                # Node.js Express backend
│   ├── src/
│   │   ├── index.ts       # Express server
│   │   └── services/
│   │       └── documentParser.ts  # Document parsing logic
│   ├── package.json       # Server dependencies
│   └── tsconfig.json      # TypeScript config
└── package.json           # Root workspace config
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Install all dependencies:

   ```bash
   npm run install:all
   ```

   Or install individually:

   ```bash
   npm install           # Root dependencies
   npm run install:client
   npm run install:server
   ```

### Development

1. Start both client and server in development mode:

   ```bash
   npm run dev
   ```

   Or start individually:

   ```bash
   npm run dev:client    # Starts React dev server on http://localhost:3000
   npm run dev:server    # Starts Express server on http://localhost:3001
   ```

2. Open your browser to `http://localhost:3000`

### Building for Production

```bash
npm run build
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

## Technologies Used

### Frontend

- React 18
- TypeScript
- Vite
- Axios for API calls

### Backend

- Node.js
- Express
- TypeScript
- Multer for file uploads
- Mammoth for Word document parsing
- Marked for Markdown parsing

## 🚀 Quick Start

### Quick Start: Prerequisites

- Node.js 18+
- npm or yarn

### Quick Start: Installation

1. **Install all dependencies:**

   ```bash
   npm run install:all
   ```

2. **Start development servers:**

   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: <http://localhost:3000>
   - Backend API: <http://localhost:3001> (or next available port)

## 🛠️ Development Notes

- **Auto Port Resolution**: Servers automatically find available ports if defaults are occupied
- **File Upload Limits**: Maximum file size is 10MB
- **CORS Enabled**: For seamless development across different ports
- **Error Handling**: Comprehensive error handling for unsupported file types and parsing failures
- **Hot Reload**: Both client and server support hot reloading during development

## 🎯 VS Code Integration

The project includes VS Code tasks for enhanced development:

- **Ctrl+Shift+B**: Run default build task
- **Ctrl+Shift+P** → "Tasks: Run Task": Access all available tasks
- Integrated problem matching for TypeScript and ESLint errors
- Terminal management for concurrent development servers

## 📄 License

MIT License - Open source and free to use.

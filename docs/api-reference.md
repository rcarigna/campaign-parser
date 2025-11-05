# 📡 API Reference

## Base URL

When running locally: `http://localhost:3000`

## Authentication

Currently, no authentication is required. All endpoints are publicly accessible.

## Endpoints

### Health Check

Check if the API is running and responsive.

**Endpoint**: `GET /api/health`

**Response**:

```json
{
  "status": "ok",
  "timestamp": "2025-11-04T10:30:00.000Z"
}
```

**Status Codes**:

- `200 OK`: Service is healthy and running

**Example**:

```bash
curl http://localhost:3000/api/health
```

---

### Document Processing

Parse a document and extract campaign entities.

**Endpoint**: `POST /api/parse`

**Content-Type**: `multipart/form-data`

**Request Body**:

- `file` (File): Document to parse (.docx or .md file)

**Response**:

```json
{
  "content": {
    "raw": "string",
    "html": "string", 
    "text": "string",
    "frontmatter": {},
    "headings": [],
    "links": [],
    "images": []
  },
  "entities": [
    {
      "kind": "npc",
      "title": "Durnan",
      "role": "barkeep",
      "sourceSessions": [1]
    }
  ],
  "metadata": {
    "size": 1024,
    "mimeType": "text/markdown",
    "lastModified": "2025-11-04T10:30:00.000Z"
  }
}
```

**Status Codes**:

- `200 OK`: Document processed successfully
- `400 Bad Request`: Invalid file or missing file
- `413 Payload Too Large`: File exceeds size limit (10MB)
- `415 Unsupported Media Type`: Unsupported file format
- `500 Internal Server Error`: Processing failed

**Example**:

```bash
curl -X POST http://localhost:3000/api/parse \
  -F "file=@session_summary.md"
```

**JavaScript Example**:

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

const response = await fetch('/api/parse', {
  method: 'POST',
  body: formData
});

const result = await response.json();
```

## Data Models

### Document Content Types

#### Markdown Content

```typescript
interface MarkdownContent {
  raw: string;              // Original markdown text
  html: string;             // Converted HTML
  text: string;             // Plain text (frontmatter stripped)
  frontmatter: object;      // YAML frontmatter
  headings: Heading[];      // Extracted headings
  links: Link[];            // Extracted links
  images: Image[];          // Extracted images
}
```

#### Word Content

```typescript
interface WordContent {
  raw: string;              // Extracted text content
  html: string;             // Converted HTML
  text: string;             // Plain text
  metadata: object;         // Document properties
}
```

### Entity Types

#### Base Entity

```typescript
interface BaseEntity {
  kind: EntityKind;
  title: string;
  sourceSessions?: number[];
}
```

#### NPC Entity

```typescript
interface NPC extends BaseEntity {
  kind: "npc";
  role?: string;            // "barkeep", "guard", "noble"
  faction?: string;         // "Zhentarim", "Harpers"
  importance?: "minor" | "supporting" | "major";
  description?: string;
  location?: string;
  class?: string;          // D&D class
  race?: string;           // D&D race
}
```

#### Location Entity

```typescript
interface Location extends BaseEntity {
  kind: "location";
  type?: string;           // "tavern", "city", "dungeon"
  region?: string;         // Broader geographical area
  description?: string;
}
```

#### Item Entity

```typescript
interface Item extends BaseEntity {
  kind: "item";
  type?: string;           // "weapon", "armor", "consumable"
  rarity?: "common" | "uncommon" | "rare" | "very_rare" | "legendary" | "artifact";
  attunement?: boolean;
  owner?: string;
  description?: string;
}
```

#### Quest Entity

```typescript
interface Quest extends BaseEntity {
  kind: "quest";
  status: "active" | "completed" | "failed" | "available";
  type?: "main" | "side" | "personal";
  quest_giver?: string;
  faction?: string;
  description?: string;
}
```

#### Session Summary Entity

```typescript
interface SessionSummary extends BaseEntity {
  kind: "session_summary";
  session_number?: number;
  brief_synopsis?: string;
  full_summary?: string;
  status: "complete" | "in_progress" | "planned";
}
```

### Supporting Types

#### Heading

```typescript
interface Heading {
  level: number;           // 1-6 (# to ######)
  text: string;           // Heading text content
  id: string;             // URL-friendly slug
}
```

#### Link

```typescript
interface Link {
  text: string;           // Display text
  url: string;            // Destination URL
  title?: string;         // Optional title attribute
}
```

#### Image

```typescript
interface Image {
  alt: string;            // Alt text
  url: string;            // Image URL
  title?: string;         // Optional title
}
```

#### Document Metadata

```typescript
interface DocumentMetadata {
  size: number;           // File size in bytes
  mimeType: string;       // MIME type
  lastModified: Date;     // Processing timestamp
}
```

## Error Handling

### Error Response Format

```json
{
  "error": "Error message description",
  "details": "Optional additional details"
}
```

### Common Error Scenarios

#### File Too Large

```json
{
  "error": "File size exceeds 10MB limit",
  "details": "Received file size: 12.5MB"
}
```

#### Unsupported File Type  

```json
{
  "error": "Unsupported file type",
  "details": "Only .md and .docx files are supported"
}
```

#### Processing Failed

```json
{
  "error": "Document processing failed", 
  "details": "Unable to extract text content"
}
```

## Rate Limits

Currently, no rate limiting is implemented. For production deployment, consider implementing rate limiting based on:

- **Requests per minute**: 60 requests per IP
- **File upload size**: 10MB maximum
- **Concurrent uploads**: 3 simultaneous uploads per IP

## File Upload Specifications

### Supported Formats

| Format | Extension | MIME Type | Notes |
|--------|-----------|-----------|-------|
| Markdown | `.md` | `text/markdown` | With optional YAML frontmatter |
| Word Document | `.docx` | `application/vnd.openxmlformats-officedocument.wordprocessingml.document` | Modern Word format only |

### File Size Limits

- **Maximum Size**: 10MB per file
- **Recommended Size**: Under 5MB for optimal performance
- **Minimum Size**: No minimum (empty files will return empty results)

### Content Requirements

**Markdown Files**:

- UTF-8 encoding required
- Optional YAML frontmatter supported
- Standard CommonMark syntax

**Word Documents**:

- `.docx` format only (not `.doc`)
- Text content will be extracted
- Images and formatting preserved in HTML output
- Tables converted to HTML tables

## Integration Examples

### Frontend Integration

```typescript
// React component example
const DocumentUploader = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file: File) => {
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/parse', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setResult(data);
      
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept=".md,.docx"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
      />
      {loading && <p>Processing...</p>}
      {result && <p>Found {result.entities.length} entities</p>}
    </div>
  );
};
```

### Node.js Integration

```javascript
const FormData = require('form-data');
const fs = require('fs');

async function parseDocument(filePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  
  const response = await fetch('http://localhost:3000/api/parse', {
    method: 'POST',
    body: form
  });
  
  return response.json();
}

// Usage
const result = await parseDocument('./session_summary.md');
console.log(`Extracted ${result.entities.length} entities`);
```

### Python Integration

```python
import requests

def parse_document(file_path):
    with open(file_path, 'rb') as file:
        files = {'file': file}
        response = requests.post('http://localhost:3000/api/parse', files=files)
        return response.json()

# Usage
result = parse_document('session_summary.md')
print(f"Extracted {len(result['entities'])} entities")
```

## Performance Considerations

### Response Times

- **Small files** (<1MB): ~200-500ms
- **Medium files** (1-5MB): ~500ms-2s  
- **Large files** (5-10MB): ~2-5s

### Optimization Tips

1. **Compress files** before upload when possible
2. **Process files sequentially** to avoid memory issues
3. **Cache results** for repeated processing
4. **Use appropriate timeouts** (30s recommended)

### Memory Usage

- **Base memory**: ~50MB for API server
- **Per request**: ~10-20MB additional during processing
- **Peak usage**: Varies with file size and complexity

## Security Considerations

### Input Validation

- File type validation via MIME type and extension
- File size limits enforced
- Content scanning for malicious patterns
- HTML output sanitization

### Recommended Production Settings

```javascript
// next.config.js
module.exports = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
  experimental: {
    serverActions: true,
  }
};
```

### CORS Configuration

For cross-origin requests in production:

```javascript
// Add to API route headers
res.setHeader('Access-Control-Allow-Origin', 'https://yourdomain.com');
res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
```

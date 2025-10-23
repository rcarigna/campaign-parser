# Markdown Content Object Documentation

This document describes the structure of the `MarkdownContent` object that is returned when parsing markdown files using the document parser.

## Test File: `session_summary_1.md`
- **File Size**: 7,246 bytes
- **Content Length**: 7,220 characters
- **Type**: D&D Campaign Session Summary

## Complete Object Structure

### Top-Level `ParsedDocument` Object
```typescript
{
  filename: string;        // "session_summary_1.md"
  type: DocumentType;      // DocumentType.MARKDOWN ("markdown")
  content: MarkdownContent;
  metadata: DocumentMetadata;
}
```

### `MarkdownContent` Object Structure
```typescript
{
  raw: string;              // Original markdown text (7,220 chars)
  html: string;             // Converted HTML (7,321 chars)
  text: string;             // Plain text version (7,220 chars)
  frontmatter: object;      // YAML frontmatter (empty {} for this file)
  headings: Heading[];      // Extracted headings (3 headings)
  links: Link[];            // Extracted links (0 links)
  images: Image[];          // Extracted images (0 images)
}
```

## Detailed Property Analysis

### 1. `raw` Property
- **Type**: `string`
- **Length**: 7,220 characters
- **Content**: Original markdown source text
- **Example** (first 200 chars):
```markdown
## 1.   A Friend in Need, Part 1:

### Synopsis:

Our adventurers gathered in the Yawning Portal tavern and inn, each for their own reasons, making first introductions and impressions. They met th...
```

### 2. `html` Property
- **Type**: `string` 
- **Length**: 7,321 characters
- **Content**: Converted HTML from markdown
- **Example** (first 200 chars):
```html
<h2>1.   A Friend in Need, Part 1:</h2>
<h3>Synopsis:</h3>
<p>Our adventurers gathered in the Yawning Portal tavern and inn, each for their own reasons, making first introductions and impressions. The...
```

### 3. `text` Property
- **Type**: `string`
- **Length**: 7,220 characters (same as raw for this file)
- **Content**: Plain text version without frontmatter
- **Note**: For this file, `text` equals `raw` since there's no YAML frontmatter to strip

### 4. `frontmatter` Property
- **Type**: `Record<string, string>`
- **Content**: `{}` (empty object)
- **Note**: This D&D session file has no YAML frontmatter block

### 5. `headings` Property
- **Type**: `Heading[]`
- **Count**: 3 headings
- **Structure**:
```typescript
[
  {
    level: 2,
    text: "1.   A Friend in Need, Part 1:",
    id: "1-a-friend-in-need-part-1"
  },
  {
    level: 3,
    text: "Synopsis:",
    id: "synopsis"
  },
  {
    level: 3,
    text: "Detailed Description:",
    id: "detailed-description"
  }
]
```

#### Heading Properties:
- **`level`**: Heading level (1-6, corresponding to # count)
- **`text`**: The heading text content
- **`id`**: URL-friendly slug for linking (lowercase, spaces→hyphens, special chars removed)

### 6. `links` Property
- **Type**: `Link[]`
- **Count**: 0 links
- **Content**: `[]` (empty array)
- **Note**: This D&D session file contains no markdown links

#### Expected Link Structure (when present):
```typescript
{
  text: string;     // Link display text
  url: string;      // Link destination
  type: 'inline' | 'reference';  // Link type
}
```

### 7. `images` Property
- **Type**: `Image[]`
- **Count**: 0 images
- **Content**: `[]` (empty array)
- **Note**: This D&D session file contains no markdown images

#### Expected Image Structure (when present):
```typescript
{
  alt: string;      // Alt text
  url: string;      // Image URL
  title?: string;   // Optional title attribute
}
```

## `DocumentMetadata` Object
```typescript
{
  size: 7246,                           // File size in bytes
  mimeType: "text/markdown",            // MIME type
  lastModified: Date                    // Timestamp when parsed
}
```

## Content Characteristics for D&D Session Files

### Key Content Patterns Found:
- **Character Names**: Cat Amcathra, Teddy, Hastur, Lainadan, Era
- **Locations**: Yawning Portal, Waterdeep, Skewered Dragon, Dock Ward, Undermountain
- **NPCs**: Durnan, Bonnie, Yagra, Volothamp Geddarm, Floon Blagmaar
- **Organizations**: Xanathar Guild, Zhentarim

### Heading Hierarchy:
- **Level 2** (##): Main session title
- **Level 3** (###): Section headers (Synopsis, Detailed Description)

### Processing Notes:
- **HTML Conversion**: Headings become `<h2>`, `<h3>` etc.
- **ID Generation**: Headings get auto-generated IDs for linking
- **Text Extraction**: Both raw markdown and plain text are preserved
- **Frontmatter**: YAML blocks are parsed and separated from content
- **Links/Images**: Extracted into structured arrays for easy access

## Usage Examples

### Accessing Heading Information
```typescript
const result = await parseDocument(markdownFile);
const content = result.content as MarkdownContent;

// Get all heading texts
const headingTexts = content.headings.map(h => h.text);
// ["1.   A Friend in Need, Part 1:", "Synopsis:", "Detailed Description:"]

// Find main session heading
const sessionHeading = content.headings.find(h => h.level === 2);
// { level: 2, text: "1.   A Friend in Need, Part 1:", id: "1-a-friend-in-need-part-1" }
```

### Content Search
```typescript
// Search for character names
const hasCharacter = (name: string) => content.text.includes(name);
console.log(hasCharacter('Cat Amcathra')); // true
console.log(hasCharacter('Volothamp Geddarm')); // true

// Search for locations
const locations = ['Yawning Portal', 'Waterdeep', 'Undermountain'];
const foundLocations = locations.filter(loc => content.text.includes(loc));
// ['Yawning Portal', 'Waterdeep', 'Undermountain']
```

### HTML Display
```typescript
// Use the HTML for display
document.getElementById('content').innerHTML = content.html;

// Or build a table of contents from headings
const toc = content.headings.map(h => 
  `<a href="#${h.id}" class="level-${h.level}">${h.text}</a>`
).join('\n');
```
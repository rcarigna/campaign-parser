# Markdown Content Object Documentation

This document describes the structure of the `MarkdownContent` object that is returned when parsing markdown files using the document parser.

**📝 Note**: As of October 2025, the parser has been migrated from regex-based parsing to library-based parsing using `gray-matter` and `markdown-it` for enhanced reliability and standards compliance.

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
- **Content**: Converted HTML from markdown using `marked` library
- **Example** (first 200 chars):

```html
<h2>1.   A Friend in Need, Part 1:</h2>
<h3>Synopsis:</h3>
<p>Our adventurers gathered in the Yawning Portal tavern and inn, each for their own reasons, making first introductions and impressions. The...
```

### 3. `text` Property

- **Type**: `string`
- **Length**: 7,220 characters (same as raw for this file)
- **Content**: Plain text version without frontmatter (processed by `gray-matter`)
- **Note**: For this file, `text` equals `raw` since there's no YAML frontmatter to strip

### 4. `frontmatter` Property

- **Type**: `Record<string, any>`
- **Content**: `{}` (empty object)
- **Parser**: `gray-matter` library for robust YAML/TOML/JSON parsing
- **Note**: This D&D session file has no YAML frontmatter block
- **Capabilities**: Supports complex YAML structures, proper type parsing, error handling

### 5. `headings` Property

- **Type**: `Heading[]`
- **Count**: 3 headings
- **Parser**: `markdown-it` AST-based extraction
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

#### Heading Properties

- **`level`**: Heading level (1-6, corresponding to # count)
- **`text`**: The heading text content (extracted from AST)
- **`id`**: URL-friendly slug for linking (lowercase, spaces→hyphens, special chars removed)

### 6. `links` Property

- **Type**: `Link[]`
- **Count**: 0 links
- **Content**: `[]` (empty array)
- **Parser**: `markdown-it` AST-based extraction with hybrid reference link detection
- **Note**: This D&D session file contains no markdown links

#### Expected Link Structure (when present)

```typescript
{
  text: string;     // Link display text
  url: string;      // Link destination (with title support: "url \"title\"")
  type: 'inline' | 'reference';  // Link type (reference links maintain original format)
}
```

**Link Parsing Features**:

- ✅ Inline links: `[text](url)`
- ✅ Links with titles: `[text](url "title")`
- ✅ Reference links: `[text][ref]` (maintains `[reference: ref]` format for backward compatibility)
- ✅ Robust URL extraction from AST tokens

### 7. `images` Property

- **Type**: `Image[]`
- **Count**: 0 images
- **Content**: `[]` (empty array)
- **Parser**: `markdown-it` AST-based extraction
- **Note**: This D&D session file contains no markdown images

#### Expected Image Structure (when present)

```typescript
{
  alt: string;      // Alt text
  url: string;      // Image URL
  title?: string;   // Optional title attribute
}
```

**Image Parsing Features**:

- ✅ Alt text extraction
- ✅ URL parsing
- ✅ Title attribute support
- ✅ Proper separation of URL and title (no more regex issues)

## `DocumentMetadata` Object

```typescript
{
  size: 7246,                           // File size in bytes
  mimeType: "text/markdown",            // MIME type
  lastModified: Date                    // Timestamp when parsed
}
```

## Parser Implementation Details

### Current Architecture (Post-Migration)

```typescript
// Frontmatter parsing with gray-matter
const { data: metadata, content: contentWithoutFrontmatter } = matter(cleanedText);

// Content extraction with markdown-it
const md = new MarkdownIt();
const tokens = md.parse(cleanedMarkdown, {});

// AST traversal for headings, links, images
tokens.forEach(token => {
  if (token.type === 'heading_open') {
    // Extract heading data from AST
  }
  if (token.type === 'inline' && token.children) {
    // Process inline content for links and images
  }
});
```

### Migration Benefits

- **🔧 Robust Error Handling**: Libraries handle edge cases automatically
- **📏 Standards Compliance**: Full CommonMark specification support
- **🚫 No More Regex Debugging**: AST-based parsing eliminates regex complexity
- **🔄 Indentation Handling**: Automatic cleanup for malformed markdown
- **⚡ Better Performance**: Optimized parsing algorithms
- **🛡️ Type Safety**: Proper TypeScript integration

## Content Characteristics for D&D Session Files

### Key Content Patterns Found

- **Character Names**: Cat Amcathra, Teddy, Hastur, Lainadan, Era
- **Locations**: Yawning Portal, Waterdeep, Skewered Dragon, Dock Ward, Undermountain
- **NPCs**: Durnan, Bonnie, Yagra, Volothamp Geddarm, Floon Blagmaar
- **Organizations**: Xanathar Guild, Zhentarim

### Heading Hierarchy

- **Level 2** (##): Main session title
- **Level 3** (###): Section headers (Synopsis, Detailed Description)

### Processing Notes

- **HTML Conversion**: Uses `marked` library for reliable HTML generation
- **ID Generation**: Consistent heading ID generation from AST
- **Text Extraction**: Both raw markdown and processed text preserved
- **Frontmatter**: Professional YAML parsing with `gray-matter`
- **Links/Images**: AST-based extraction ensures accuracy

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

### Working with Enhanced Frontmatter

```typescript
// The new parser supports complex YAML structures
const markdownWithFrontmatter = `---
title: "D&D Session 1"
date: 2024-01-15
characters:
  - name: "Cat Amcathra"
    class: "Rogue"
  - name: "Teddy"
    class: "Fighter"
tags: ["dnd", "waterdeep", "session-1"]
---

# Session Content...`;

const result = await parseDocument(markdownFile);
const content = result.content as MarkdownContent;

// Access structured frontmatter data
console.log(content.frontmatter.title);      // "D&D Session 1"
console.log(content.frontmatter.date);       // "2024-01-15"
console.log(content.frontmatter.characters); // Array of character objects
console.log(content.frontmatter.tags);       // ["dnd", "waterdeep", "session-1"]
```

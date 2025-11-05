# 🎭 Demo Feature Guide

## Overview

The Campaign Parser demo feature provides an interactive way to explore the application's capabilities using real campaign session notes. New users can immediately see how the parser extracts entities without needing to upload their own documents.

---

## Features

### 🚀 Quick Demo Access

- **One-Click Demo**: Load example data instantly from the main page
- **No File Upload Required**: Pre-configured with session_summary_1.md from the repository
- **Full Functionality**: Access all parser features with demo data

### 📄 Session Notes Display

- **Dual View Mode**: Toggle between formatted markdown and raw text
- **Formatted View**: Rendered markdown with proper headings, lists, and formatting
- **Raw View**: See the original markdown source for better understanding

### ✨ Entity Extraction Showcase

The demo automatically extracts and displays:
- **NPCs**: Durnan, Volothamp Geddarm, Yagra, Bonnie, and more
- **Locations**: Yawning Portal, Waterdeep, Undermountain, Dock Ward, Temple of Gond
- **Items**: Ancestral Blade
- **Quests/Events**: Find missing friend Floon Blagmaar

---

## How to Use

### Step 1: Access the Demo

1. Open the Campaign Parser application
2. Look for the **"🎭 Try Demo"** tab at the top of the page (it's the default tab)
3. You'll see a purple card with information about the demo

### Step 2: Load the Demo Data

1. Click the **"🚀 Load Example Session"** button
2. Wait a moment while the session note is loaded and parsed
3. A success toast notification will appear when ready

### Step 3: Explore the Session Notes

The session notes section displays the example D&D campaign session:

- **Formatted View** (default): Clean, rendered markdown with proper styling
- **Raw Markdown View**: Click "Raw Markdown" to see the original source
- Toggle between views using the buttons above the content

### Step 4: Review Extracted Entities

Scroll down to the **"✨ Extracted Entities"** section:

- **Entity Count**: See how many entities were automatically extracted
- **Entity Grid**: Browse all identified NPCs, locations, items, and quests
- **Entity Cards**: Each entity shows its type, title, and key information
- **Filtering**: Use the filter controls to view specific entity types
- **Search**: Use the search bar to find specific entities

### Step 5: Test Features

With the demo data loaded, you can:

- **Edit Entities**: Click on any entity card to view/edit details
- **Merge Duplicates**: Test the deduplication workflow
- **Filter & Search**: Practice using the filtering and search tools
- **Export to Obsidian**: Generate and download vault-ready files
- **View Entity Details**: Explore relationships and metadata

### Step 6: Clear and Restart

- Click **"Clear Demo"** to reset and start over
- Switch to the **"📤 Upload Document"** tab to try your own files

---

## Technical Implementation

### Architecture

```
Demo Feature Flow:
1. User clicks "Load Example Session"
2. Frontend calls /api/demo endpoint
3. Backend reads __mocks__/session_summary_1/session_summary_1.md
4. Document is parsed using standard parsing pipeline
5. Entities extracted using NLP + regex patterns
6. Response includes parsed data, entities, and raw markdown
7. Frontend displays in DemoSection component
```

### Components

#### DemoSection Component
**Location**: `src/components/Demo/DemoSection.tsx`

**Features**:
- Load/Clear demo functionality
- Markdown view toggle (formatted/raw)
- Entity display with full EntityViewer integration
- Loading states and error handling
- Toast notifications for user feedback

**Props**:
```typescript
type DemoSectionProps = {
    onDemoLoad?: (data: DemoDataResponse) => void;
};
```

#### MarkdownRenderer Component
**Location**: `src/components/Demo/MarkdownRenderer.tsx`

**Features**:
- Renders markdown using the `marked` library
- Applies Tailwind prose classes for styling
- Handles markdown parsing asynchronously

**Props**:
```typescript
type MarkdownRendererProps = {
    markdown: string;
};
```

### API Endpoint

#### GET /api/demo
**Location**: `src/app/api/demo/route.ts`

**Functionality**:
- Reads session_summary_1.md from __mocks__ directory
- Parses document using standard document parser
- Extracts entities using entity extraction engine
- Returns parsed data with raw markdown

**Response Type**:
```typescript
type DemoDataResponse = SerializedParsedDocumentWithEntities & {
    rawMarkdown: string;
};
```

**Example Response**:
```json
{
  "filename": "session_summary_1.md",
  "type": "markdown",
  "content": {
    "raw": "## Session Summary...",
    "html": "<h2>Session Summary</h2>...",
    "frontmatter": {},
    "headings": [...],
    "links": [...],
    "images": [...]
  },
  "entities": [
    {
      "kind": "npc",
      "title": "Durnan",
      "role": "Barkeep",
      "importance": "major"
    }
  ],
  "rawMarkdown": "## Session Summary...",
  "metadata": {
    "size": 7246,
    "lastModified": "2024-01-01T00:00:00Z",
    "mimeType": "text/markdown"
  }
}
```

---

## Example Session Content

The demo uses **Session Summary #1** from a Waterdeep: Dragon Heist campaign:

**Synopsis**: Adventurers gather at the Yawning Portal tavern, meet various NPCs, fight a troll that emerges from Undermountain, and receive a quest from Volothamp Geddarm to find his missing friend Floon.

**Key Story Beats**:
1. Party introductions at the Yawning Portal
2. Meeting Durnan (barkeep) and Bonnie (barmaid)
3. Breaking up a fight between Xanathar Guild thugs and Yagra
4. Combat with a troll and stirges from Undermountain
5. Quest offer from Volo to find Floon Blagmaar

**Extracted Entities Include**:
- **NPCs**: Durnan, Volothamp Geddarm (Volo), Yagra, Bonnie, Floon Blagmaar
- **Player Characters**: Cat Amcathra, Teddy, Hastur, Lainadan, Era
- **Locations**: Yawning Portal, Waterdeep, Undermountain, Dock Ward, Skewered Dragon, Temple of Gond
- **Factions**: Xanathar Guild, Zhentarim
- **Items**: Ancestral Blade
- **Quests**: Find missing friend Floon Blagmaar

---

## User Benefits

### For New Users
- **No Setup Required**: Start exploring immediately
- **Learn by Example**: See how the parser handles real campaign data
- **Risk-Free Testing**: No need to upload personal documents
- **Feature Discovery**: Discover all capabilities through guided experience

### For Contributors
- **Testing Environment**: Quick way to test new features
- **Integration Testing**: Verify end-to-end functionality
- **Example Reference**: Real-world data for development
- **Documentation Aid**: Visual reference for explaining features

### For Evaluators
- **Quick Assessment**: Evaluate parser quality instantly
- **Capabilities Showcase**: See all features in action
- **Data Quality Check**: Review extraction accuracy
- **UI/UX Testing**: Explore user interface without commitment

---

## Customization

### Using Different Example Data

To use a different session note for the demo:

1. Add your example file to `__mocks__/`
2. Update the file path in `src/app/api/demo/route.ts`:
   ```typescript
   const filePath = join(process.cwd(), '__mocks__', 'your_file.md');
   ```
3. Update the description in `DemoSection.tsx` to match your content

### Adding Multiple Demo Options

To support multiple demo sessions:

1. Update the API to accept a query parameter:
   ```typescript
   export async function GET(request: NextRequest) {
       const session = request.nextUrl.searchParams.get('session') || 'session_1';
       // Load different files based on session parameter
   }
   ```

2. Add a session selector in `DemoSection.tsx`:
   ```tsx
   <select onChange={(e) => loadDemo(e.target.value)}>
       <option value="session_1">Session 1</option>
       <option value="session_2">Session 2</option>
   </select>
   ```

---

## Testing

The demo feature includes comprehensive tests:

### Component Tests
- **DemoSection.test.tsx**: Tests for loading, displaying, toggling views, and clearing
- **MarkdownRenderer.test.tsx**: Tests for markdown rendering functionality

### API Tests
- **route.test.ts**: Tests for successful data loading and error handling

### Integration
- All tests integrated with existing test suite
- 129 tests passing (15 tests added for demo feature)

---

## Troubleshooting

### Demo Won't Load
- **Check Console**: Look for error messages in browser console
- **Verify File**: Ensure `__mocks__/session_summary_1/session_summary_1.md` exists
- **Check API**: Test `/api/demo` endpoint directly in browser

### Entities Not Displaying
- **Refresh Page**: Clear browser cache and reload
- **Check Response**: Verify API response includes entities array
- **Review Logs**: Check server logs for parsing errors

### Markdown Not Rendering
- **Toggle Views**: Try switching between formatted and raw views
- **Check marked Library**: Ensure marked package is installed
- **Verify Content**: Check that rawMarkdown field is present in response

---

## Future Enhancements

Potential improvements for the demo feature:

- **Multiple Sessions**: Support loading different example sessions
- **Guided Tour**: Interactive walkthrough of features
- **Comparison Mode**: Side-by-side view of before/after deduplication
- **Export Preview**: Show what Obsidian export files look like
- **Custom Examples**: Allow users to share their own example sessions
- **Video Tutorial**: Embedded video showing feature usage
- **Interactive Highlights**: Click entities in text to see extracted data

---

## Related Documentation

- [Architecture Overview](./architecture.md)
- [Entity Extraction Guide](./entity-extraction.md)
- [API Reference](./api-reference.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

---

*The demo feature makes Campaign Parser accessible to everyone, from first-time users to experienced contributors.*

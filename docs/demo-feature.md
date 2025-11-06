# 🎭 Demo Feature Guide

## Overview

The Campaign Parser demo feature provides an integrated way to explore the application's capabilities using real campaign session notes. New users can immediately see how the parser extracts entities without needing to upload their own documents, all within the main application workflow.

---

## Features

### 🚀 Integrated Demo Access

- **One-Click Demo**: Load example data instantly from the main page
- **Streamlined Experience**: Demo integrates seamlessly with upload workflow
- **No File Upload Required**: Pre-configured with session_summary_1.md from the repository
- **Full Functionality**: Access all parser features with demo data
- **Persistent Interface**: Welcome message and entity types remain visible throughout

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
2. You'll see the main welcome screen with entity type information
3. Look for the **"🎭 Try Demo"** button in the welcome section

### Step 2: Load the Demo Data

1. Click the **"🎭 Try Demo"** button
2. Wait a moment while the session note is loaded and parsed
3. A success toast notification will appear when ready
4. The upload section will be replaced with a reset button

### Step 3: Explore the Persistent Interface

The application maintains a consistent interface:

- **Welcome Message**: Always visible at the top
- **Entity Types Grid**: Persistent display of NPC, Location, Item, and Quest types
- **Smart Workflow**: Upload section replaced with reset functionality after demo loads

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

### Step 6: Reset and Continue

- Click **"🔄 Reset"** to clear demo data and return to upload interface
- Upload your own documents to continue with real campaign data
- The welcome message and entity types remain visible throughout

---

## Technical Implementation

### Architecture

```plaintext
Demo Feature Flow:
1. User clicks "🎭 Try Demo" button in welcome section
2. Frontend calls parseDocument with demo file content
3. Document is parsed using standard parsing pipeline
4. Entities extracted using NLP + regex patterns
5. Upload interface replaced with reset button
6. Results displayed in unified interface
7. Welcome message and entity types remain persistent
```

### Components

#### WelcomeSection Component

**Location**: `src/components/Layout/WelcomeSection.tsx`

**Features**:

- Contains demo trigger button when no content is loaded
- Integrates seamlessly with main application workflow
- Provides entity types grid that remains persistent
- Handles demo loading through main application hooks

#### ProcessingWorkflow Component

**Location**: `src/components/Layout/ProcessingWorkflow.tsx`

**Features**:

- Smart interface switching based on content state
- Shows upload interface when no content present
- Shows reset button when content is loaded (demo or uploaded)
- Handles both demo and file upload workflows
- Loading states and error handling
- Toast notifications for user feedback

#### PersistentWelcome Component

**Location**: `src/components/Layout/PersistentWelcome.tsx`

**Features**:

- Always-visible welcome message and entity types grid
- Remains consistent throughout demo and upload workflows
- Provides persistent context for users

### API Integration

#### Demo Loading Process

**Integration**: Direct file processing through main application hooks

**Functionality**:

- Uses existing `useCampaignParser` hook for demo loading
- Reads session_summary_1.md from public assets or embedded content
- Processes demo content using standard document parsing pipeline
- No separate API endpoint needed - integrates with existing infrastructure

**Demo Content Type**:

```typescript
// Demo content is processed as standard document content
type DemoContent = {
    filename: string;
    content: string; // Raw markdown content
    type: 'markdown';
};
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

- **Immediate Access**: Start exploring without any setup or file preparation
- **Integrated Experience**: Demo flows naturally with the main application
- **Learn by Example**: See how the parser handles real campaign data
- **Risk-Free Testing**: No need to upload personal documents
- **Persistent Guidance**: Entity types and welcome message provide ongoing context

### For Contributors

- **Simplified Testing**: Quick way to test features in realistic scenarios
- **Integration Validation**: Verify end-to-end functionality works correctly
- **Example Reference**: Real-world data for development and testing
- **Component Testing**: Easy way to test component interactions

### For Evaluators

- **Quick Assessment**: Evaluate parser quality instantly
- **Capabilities Showcase**: See all features in action within natural workflow
- **Data Quality Check**: Review extraction accuracy with real content
- **UI/UX Testing**: Explore user interface with meaningful data

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

The demo feature is integrated with the main application testing suite:

### Component Tests

- **WelcomeSection.test.tsx**: Tests for demo button functionality and integration
- **ProcessingWorkflow.test.tsx**: Tests for smart upload/reset switching  
- **PersistentWelcome.test.tsx**: Tests for persistent interface components

### Integration Tests

- **Main application hooks**: Tests verify demo loading through standard workflows
- **Entity extraction**: Demo content processed through same pipelines as uploaded files

### Test Coverage

- All demo functionality covered by existing 260 test suite
- No separate demo-specific API tests needed due to integrated approach

---

---

## Troubleshooting

### Demo Won't Load

- **Check Console**: Look for error messages in browser console
- **Verify Integration**: Ensure demo content loading through standard hooks
- **Check State**: Verify application state management for demo data

### Entities Not Displaying

- **Refresh Page**: Clear browser cache and reload
- **Check Processing**: Verify demo content is processed through entity extraction
- **Review State**: Check that entities are properly loaded into application state

### Interface Not Updating

- **State Management**: Verify hooks are properly managing demo vs upload states
- **Component Updates**: Check that ProcessingWorkflow switches correctly
- **Reset Functionality**: Ensure reset button properly clears demo data

---

## Future Enhancements

Potential improvements for the demo feature:

- **Multiple Demo Sessions**: Support loading different example sessions
- **Guided Tutorial**: Interactive walkthrough highlighting key features
- **Enhanced Onboarding**: Progressive disclosure of advanced features
- **Demo Variations**: Different campaign types (mystery, dungeon crawl, political intrigue)
- **Interactive Highlights**: Click entities in content to see extracted data
- **Comparison Mode**: Before/after views showing extraction improvements
- **Custom Examples**: Community-contributed example sessions
- **Video Integration**: Embedded tutorials showing feature usage

---

## Related Documentation

- [Architecture Overview](./architecture.md)
- [Entity Extraction Guide](./entity-extraction.md)
- [API Reference](./api-reference.md)
- [Contributing Guidelines](../CONTRIBUTING.md)

---

*The integrated demo feature makes Campaign Parser immediately accessible, providing a seamless introduction to entity extraction within the natural application workflow.*

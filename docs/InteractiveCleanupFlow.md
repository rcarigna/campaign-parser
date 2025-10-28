# Interactive Manual Entity Cleanup Process

This document describes the user flow for the interactive entity cleanup process after document parsing.

## Flow Diagrams

### 1. High-Level Process Flow

```mermaid
flowchart LR
    A[📄 Upload Document] --> B[🔍 Parse Entities]
    B --> C[📋 Review Cards]
    C --> D[✏️ Interactive Cleanup]
    D --> E[📤 Export Results]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#f1f8e9
```

### 2. Entity Card Information Display

```mermaid
flowchart TD
    Card[Entity Card] --> Parsed[✅ Parsed Fields]
    Card --> Missing[⚠️ Missing Fields]
    Card --> Duplicate[🔄 Duplicate Status]
    Card --> Actions[🎯 Available Actions]
    
    Parsed --> P1[Name/Title]
    Parsed --> P2[Type/Kind]
    Parsed --> P3[Description]
    
    Missing --> M1[Role]
    Missing --> M2[Faction]
    Missing --> M3[Status]
    
    Duplicate --> D1[Auto-detected]
    Duplicate --> D2[User-marked]
    
    Actions --> A1[Edit]
    Actions --> A2[Mark Duplicate]
    Actions --> A3[Discard]
```

### 3. User Action Workflows

```mermaid
flowchart TD
    Start[User Reviews Card] --> Edit[Edit Individual Entity]
    Start --> Select[Select Multiple for Duplicates]
    Start --> Discard[Discard Unwanted Entity]
    
    Edit --> EditModal[Open Edit Modal]
    EditModal --> Save[Save Changes]
    Save --> Updated[Card Updated]
    
    Select --> SelectMode[Enter Selection Mode]
    SelectMode --> Choose[Choose 2+ Cards]
    Choose --> Merge[Merge Duplicates]
    Merge --> Primary[Choose Primary Entity]
    Primary --> Combined[Combine Fields]
    Combined --> Remove[Remove Duplicates]
    
    Discard --> Confirm[Confirm Removal]
    Confirm --> Gone[Card Removed]
    
    Updated --> Continue[Continue Review]
    Remove --> Continue
    Gone --> Continue
    Continue --> Done{All Done?}
    Done -->|No| Start
    Done -->|Yes| Export[Export Results]
```

## Detailed User Stories

### 1. Document Upload & Parse

- **As a user**, I upload a campaign document (MD/DOC)
- **The app** parses entities and displays them as cards
- **Each card shows** parsed fields, missing field warnings, and potential duplicate indicators

### 2. Entity Card Review

- **As a user**, I can see at a glance:
  - ✅ **Parsed Fields**: Successfully extracted data (name, type, description)
  - ⚠️ **Missing Fields**: Required fields that need manual input (role, faction, status)
  - 🔄 **Potential Duplicates**: Auto-detected similar entities highlighted
  - 🎯 **Actions Available**: Edit, Mark Duplicate, Discard, Keep Separate

### 3. Interactive Actions

#### Edit Entity (Individual Cleanup)

```mermaid
sequenceDiagram
    participant U as User
    participant C as Entity Card
    participant M as Edit Modal
    participant S as State Manager
    
    U->>C: Click "Edit" on card
    C->>M: Open edit modal
    M->>U: Show form with current + missing fields
    U->>M: Fill in missing data
    U->>M: Correct any parsing errors
    U->>M: Click "Save"
    M->>S: Update entity data
    S->>C: Refresh card display
    C->>U: Show updated card with ✅ complete status
```

#### Mark as Duplicates (Batch Cleanup)

```mermaid
sequenceDiagram
    participant U as User
    participant V as EntityViewer
    participant G as EntityGrid
    participant C as EntityCard
    participant M as MergeModal
    
    U->>V: Click "Select Duplicates"
    V->>V: Enter selection mode
    V->>G: Show checkboxes on all cards
    U->>C: Select multiple cards (2+)
    C->>V: Update selection count
    U->>V: Click "Mark as Duplicates"
    V->>M: Open merge modal
    M->>U: Show merge options (choose primary, combine fields)
    U->>M: Configure merge settings
    U->>M: Confirm merge
    M->>V: Execute merge operation
    V->>G: Remove duplicate cards, update primary
    G->>U: Show cleaned grid
```

#### Discard Entity

```mermaid
sequenceDiagram
    participant U as User
    participant C as Entity Card
    participant D as Confirm Dialog
    participant G as EntityGrid
    
    U->>C: Click "Discard"
    C->>D: Show confirmation dialog
    D->>U: "Are you sure? This entity will be removed."
    U->>D: Confirm discard
    D->>G: Remove card from grid
    G->>U: Show updated grid without discarded entity
```

## Current Implementation Status

### ✅ Completed Features

- [x] Document upload and parsing
- [x] Entity card display with parsed fields
- [x] Missing field indicators
- [x] Auto-detected duplicate highlighting
- [x] Edit modal for individual entities
- [x] Selection mode for manual duplicate marking
- [x] Basic duplicate merging logic

### 🚧 In Progress

- [ ] Discard functionality
- [ ] Merge modal for duplicate resolution
- [ ] Final review and export options
- [ ] Session persistence

### 💡 Enhancement Ideas

- [ ] Undo/Redo for actions
- [ ] Bulk edit operations
- [ ] Custom duplicate detection rules
- [ ] Export format options (JSON, CSV, XML)
- [ ] Entity relationship visualization
- [ ] Confidence scores for auto-detected duplicates

## Technical Architecture Notes

### State Management Flow

```mermaid
graph LR
    A[Document Upload] --> B[Parse Service]
    B --> C[Entity State]
    C --> D[EntityViewer Component]
    D --> E[EntityGrid Component]
    E --> F[EntityCard Components]
    F --> G[User Actions]
    G --> H[State Updates]
    H --> C
```

### Component Hierarchy

```text
EntityViewer (State Management)
├── EntityFilters (Filtering & Search)
├── SelectionControls (Duplicate Actions)
├── EntityGrid (Layout)
│   └── EntityCard[] (Individual Items)
│       ├── ParsedFields
│       ├── MissingFieldWarnings
│       ├── DuplicateIndicators
│       └── ActionButtons
├── EntityEditModal (Individual Edit)
└── EntityMergeModal (Duplicate Resolution)
```

This flow ensures a comprehensive, user-friendly cleanup process that handles the complexity of entity management while keeping the interface intuitive.

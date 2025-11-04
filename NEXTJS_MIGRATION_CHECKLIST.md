# Next.js Migration Checklist 🚀

**Goal**: Transform current monorepo (React + Vite + Express + Shared) into a unified Next.js application to eliminate infrastructure complexity while preserving all functionality.

## 📋 Migration Overview

### Current Pain Points SOLVED ✅

- ✅ Multiple package.json files (4 total: root + client + server + shared)
- ✅ Complex dev script orchestration with concurrently  
- ✅ Proxy configuration for API communication
- ✅ Port management (3000 client, 3005 server, different environments)
- ✅ Build coordination (shared → client → server dependencies)
- ✅ Separate deployment artifacts
- ✅ Jest configuration duplication
- ✅ TypeScript config proliferation

### Target Architecture ACHIEVED ✅

- ✅ **Single Next.js app** with App Router (/api/health, /api/parse)
- ✅ **API Routes** replace Express server (migration complete)
- ✅ **Unified TypeScript** configuration (builds successfully)
- ✅ **Single package.json** with all dependencies (workspace pattern)
- ✅ **Integrated testing** with single Jest config (14 tests passing)
- ✅ **One build command** for deployment (next build working)
- ✅ **No proxy configuration** needed (direct API routes)

---

## Phase 0: Backup

- [X] Move existing code into `obsidian-parser-vite-express` directory
- [X] Ensure it works from there

## Phase 1: Foundation Setup 🏗️

### 1.1 Create Next.js Application

- [X] Initialize new Next.js app with TypeScript: `npx create-next-app@latest obsidian-parser-nextjs --typescript --tailwind --app --src-dir`
- [X] Configure as sibling directory to current workspace
- [X] Set up proper `.gitignore` for Next.js
- [X] Configure `next.config.js` for file uploads and API handling
- [X] **Install React Compiler**: `npm install babel-plugin-react-compiler`
- [X] **Configure React Compiler** in `next.config.js` for automatic memoization

### 1.2 Dependency Consolidation

- [X] Merge all dependencies from client/server/shared packages into single `package.json`
- [X] Client deps: `react`, `react-dom`, `axios`, `react-hot-toast`, `@testing-library/*`
- [X] Server deps: `compromise`, `cors`, ~~`express`~~ → ✅ removed (using Next.js API), `gray-matter`, `mammoth`, `marked`, ~~`multer`~~ → ✅ will use Next.js FormData
- [X] Dev deps: All TypeScript, Jest, ESLint configs consolidated
- [X] Remove workspace references (`@obsidian-parser/shared`) since everything is now internal

### 1.2.1 Additional Dependencies Needed

- [X] Add missing testing libraries: `@testing-library/jest-dom`, `@testing-library/user-event`, `identity-obj-proxy`
- [X] Consider adding: `remark`, `remark-html`, `remark-parse`, `unified` (for advanced markdown processing)
- [X] Optional: Remove `cors`, `multer`, `nodemon` (not needed in Next.js)

### 1.3 TypeScript Configuration

- [X] Single `tsconfig.json` with Next.js defaults
- [X] Configure path aliases: `@/components/*`, `@/lib/*`, `@/types/*`
- [X] Set up strict TypeScript with existing project settings
- [X] Remove separate tsconfig files
- [X] **Bonus**: Added comprehensive Jest configuration with path alias support
- [X] **Bonus**: Set up test utilities and mocks for Next.js environment

---

## Phase 2: Code Migration 📦

### 2.1 Shared Types Integration

- [X] Move `shared/src/types.ts` → `src/types/index.ts`
- [X] Move `shared/src/campaign.ts` → `src/types/campaign.ts`
- [X] Move `shared/src/document.ts` → `src/types/document.ts`
- [X] Move `shared/src/fileValidation.ts` → `src/types/fileValidation.ts`
- [X] Update all imports from `@obsidian-parser/shared` → `@/types`
- [X] Ensure all entity types (`NPC`, `Location`, `Item`, etc.) are properly exported
- [X] **Bonus**: Fixed circular dependencies and proper type relationships

### 2.2 Client Components Migration

- [X] **Phase 2.2a: Basic Components** (4/13 complete)
  - [X] `Header.tsx` - simple layout component
  - [X] `FileUpload.tsx` - drag/drop functionality with Next.js compatibility
  - [X] `ActionButtons.tsx` - process/reset controls
  - [X] `EntityCard.tsx` - entity display with proper type integration

- [X] **Phase 2.2b: Document Components**
  - [X] `ParsedResults.tsx` - simplified version ready for EntityViewer integration

- [ ] **Phase 2.2c: Entity Components** (4 remaining, complex)
  - [ ] `EntityFilters.tsx` - type filtering and duplicate toggles
  - [X] `EntityGrid.tsx` - entity list display and selection ✅
  - [ ] `EntityViewer.tsx` - main entity management container (complex hooks)
  - [ ] `EntityEditModal.tsx` - entity editing functionality
  - [ ] `DuplicateManager.tsx` - duplicate detection and management

- [X] **Phase 2.2d: Layout Components**
  - [X] Header component migrated
  - [X] Notification component verified as unused/empty

### 2.3 Services Layer Migration

- [X] **Document Service Migration**
  - [X] Moved `documentService.ts` → `src/lib/services/documentService.ts`
  - [X] Updated imports to use `@/types` path aliases  
  - [X] Maintained axios dependency (working well with Next.js)
  - [X] Updated FormData field name from 'document' to 'file' for Next.js API

### 2.4 React Hooks Migration

- [X] **Phase 2.4a: File Management Hook**
  - [X] Migrated `useFileManager.ts` with proper Next.js imports
  - [X] Fixed type imports to use `@/types` path aliases
  - [X] All 7 tests passing: file validation, size limits, MIME type checking
  - [X] Proper integration with `AllowedMimeType` enum from types

- [X] **Phase 2.4b: Campaign Parser Hook**  
  - [X] Migrated `useCampaignParser.ts` with `@/lib/services` integration
  - [X] Updated to use uploadDocument service with Next.js API endpoints
  - [X] All 7 tests passing: document processing, error handling, loading states
  - [X] Proper entity state management with restore/discard functionality
  - [X] Preserved existing error handling patterns
  - [X] All tests passing with Next.js integration

### 2.4 Hooks Migration ✅ COMPLETED

- [X] Move `client/src/hooks/` → `src/hooks/`
- [X] **UPDATED**: All hooks migrated and working with Next.js API routes
- [X] **UPDATED**: File upload logic adapted for Next.js FormData handling
- [X] **UPDATED**: Entity management functionality preserved and tested
- [X] **UPDATED**: File validation working with Next.js environment
- [X] **UPDATED**: All hook imports updated throughout components
- [X] **BONUS**: 63 tests passing including comprehensive hook coverage

---

## Phase 3: API Routes Creation 🔌 ✅ COMPLETED

### 3.1 Health Check Endpoint

- [X] Create `src/app/api/health/route.ts`
- [X] Migrate logic from `server/src/routes/health.ts`  
- [X] Implement GET handler returning server status JSON
- [X] Test endpoint accessibility (<http://localhost:3000/api/health>)

### 3.2 Document Parser Endpoint

- [X] Create `src/app/api/parse/route.ts` with POST handler
- [X] Set up Next.js file upload handling (replaced multer with FormData/File API)
- [X] Migrate `server/src/routes/parse.ts` logic completely
- [X] Import document parsing services from `@/lib/services`
- [X] Handle multipart/form-data in Next.js way (File → Buffer conversion)
- [X] Implement proper error responses with NextResponse

### 3.3 Entity Extraction Services

- [X] Move `server/src/services/` → `src/lib/services/` (complete)
- [X] Migrate `documentParser/`:
  - [X] `documentParser.ts` - Word/Markdown parsing with mammoth, marked, gray-matter
  - [X] Async markdown processing and proper TypeScript types
  - [X] Preserved frontmatter parsing and heading/link/image extraction
- [X] Migrate `entityExtractor/`:
  - [X] `entityExtractor.ts` - regex-based extraction with campaign entities  
  - [X] `nlpEntityExtractor.ts` - compromise.js NLP logic maintained
  - [X] Campaign-specific dictionaries (NPCs, locations, items, roles) preserved
- [X] Update all internal imports to Next.js path structure (`@/types`, `@/lib/services`)

---

## Phase 4: Testing Migration 🧪 ✅ COMPLETED

### 4.1 Jest Configuration

- [X] Create single `jest.config.js` for Next.js
- [X] Configure to test both components and API routes
- [X] Set up `@testing-library/react` for component tests
- [X] Configure coverage collection across entire app
- [X] **BONUS**: Fixed VS Code Jest extension compatibility
- [X] **BONUS**: Dual configuration (root + Next.js) working perfectly

### 4.2 Component Tests

- [X] Move `client/src/**/*.test.tsx` → `src/**/*.test.tsx`
- [X] Update imports in all test files
- [X] Verify `EntityViewer`, `FileUpload`, `DocumentService` tests work
- [X] **UPDATED**: 63 tests passing across all components and services
- [X] **BONUS**: Added comprehensive hook tests (useFileManager, useCampaignParser)

### 4.3 API Route Tests  

- [X] **UPDATED**: All services tested and working with Next.js API routes
- [X] **UPDATED**: Document parsing tested with Next.js request/response objects
- [X] **UPDATED**: Entity extraction accuracy verified and working
- [X] **UPDATED**: Coverage exceeds 70% threshold with 63 passing tests
- [X] **BONUS**: TypeScript type safety validated across entire codebase

---

## Phase 5: Styling & Assets 🎨

### 5.1 CSS Migration

- [ ] Move `client/src/App.css` → `src/styles/globals.css`
- [ ] Move `client/src/index.css` → integrate with Tailwind/globals
- [ ] Update CSS imports in components for Next.js structure
- [ ] Ensure all styling continues to work

### 5.2 Static Assets

- [ ] Move any static assets from `client/public/` → `public/`
- [ ] Update asset references in components
- [ ] Verify favicon and other meta assets work

### 5.3 HTML Template

- [ ] Migrate `client/index.html` logic to Next.js `layout.tsx`
- [ ] Set up proper meta tags and document structure
- [ ] Configure viewport and responsive settings

---

## Phase 6: Build & Development 🔨

### 6.1 Development Scripts

- [ ] Replace complex monorepo scripts with simple Next.js commands:
  - [ ] `npm run dev` → Next.js dev server (single command!)
  - [ ] `npm run build` → Next.js build (single command!)
  - [ ] `npm run start` → Next.js production start
- [ ] Remove `concurrently` orchestration complexity
- [ ] Remove proxy configuration needs
- [ ] Test hot reload works for both frontend and backend changes

### 6.2 Build Configuration

- [ ] Configure `next.config.js` for:
  - [ ] **React Compiler integration** for automatic optimization
  - [ ] File upload handling
  - [ ] API route optimization
  - [ ] Static asset optimization
  - [ ] Production build settings
- [ ] Remove separate build artifacts (client/dist, server/dist)
- [ ] Test production build works correctly

---

## Phase 7: Environment & Deployment 🌍

### 7.1 Environment Variables

- [ ] Consolidate environment configuration:
  - [ ] Remove separate client/server .env files
  - [ ] Create single `.env.local` for development
  - [ ] Set up production environment variables
- [ ] Update any hardcoded ports/URLs
- [ ] Configure file upload limits in Next.js

### 7.2 Deployment Preparation

- [ ] Update GitHub Actions workflow for single Next.js build
- [ ] Remove Docker configurations for monorepo
- [ ] Set up Vercel/other deployment if desired
- [ ] Create production deployment guide

---

## Phase 8: Testing & Validation ✅

### 8.1 Functionality Testing

- [ ] Test file upload (Word documents, Markdown files)
- [ ] Verify document parsing accuracy matches current system
- [ ] Test entity extraction (NLP and regex-based)
- [ ] Verify entity management (filtering, selection, discard)
- [ ] Test error handling and user feedback
- [ ] Verify responsive design works

### 8.2 Performance Testing  

- [ ] Compare build times (should be much faster)
- [ ] Test development startup time (should be much faster)
- [ ] Verify API response times match current performance
- [ ] Test file upload performance

### 8.3 Integration Testing

- [ ] End-to-end testing of complete user flow
- [ ] Test edge cases (large files, malformed documents)
- [ ] Verify error states and user feedback
- [ ] Test browser compatibility

---

## Phase 9: Migration Cutover 🔄

### 9.1 Final Validation

- [ ] Run all tests and ensure >90% coverage
- [ ] Performance benchmarks meet current standards
- [ ] All original functionality preserved
- [ ] Documentation updated

### 9.2 Cutover Process

- [ ] Create backup branch of current monorepo
- [ ] Replace workspace contents with Next.js app
- [ ] Update README.md with simplified instructions
- [ ] Update package.json scripts documentation
- [ ] Archive old monorepo files

### 9.3 Post-Migration Cleanup

- [ ] Remove unused dependencies and configs
- [ ] Clean up old documentation references
- [ ] Update development guide
- [ ] Celebrate infrastructure simplification! 🎉

---

## 🎯 Current Migration Status

### ✅ Completed Achievements

**Foundation & Types:**

- ✅ Next.js 16 with React Compiler integration
- ✅ Complete type system migration from `@obsidian-parser/shared`
- ✅ Jest configuration fixed for VS Code compatibility
- ✅ Single package.json with consolidated dependencies
- ✅ Path aliases working (`@/types`, `@/components`, `@/services`)

**Component Migration Progress (6/13 components):**

- ✅ Document: FileUpload, ActionButtons, ParsedResults (simplified)
- ✅ Entity: EntityCard with proper type integration
- ✅ Layout: Header component
- ✅ All migrated components have comprehensive tests (35+ passing)

**Services & Infrastructure:**

- ✅ Document service migrated with axios integration
- ✅ Testing infrastructure fully functional
- ✅ React Compiler configured for automatic optimization

### 🔄 In Progress

#### Phase 2.2c: Entity Components (4 remaining)

- 🔄 EntityFilters (started)
- ✅ EntityGrid (completed with 7 tests)
- ⏳ EntityViewer, EntityEditModal, DuplicateManager

### 📋 Remaining Work

**Core Application Logic:**

- ⏳ Phase 2.2c: Complete remaining entity management components
- ⏳ Phase 5: Styling & Assets (CSS migration, static assets)
- ⏳ Phase 6: Build & Development (build configuration, scripts)
- ⏳ Phase 8: Final testing and validation

**MAJOR UPDATE: Server migration is COMPLETE!**

- ✅ Express server eliminated
- ✅ API routes functional (/api/health, /api/parse)
- ✅ All services migrated
- ✅ 70 tests passing (updated)
- ✅ Jest configuration working

## 🎯 Success Criteria

### Developer Experience Improvements

- ✅ Single `npm run dev` starts everything
- ✅ Single `npm run build` builds everything  
- ✅ No more port conflicts or proxy issues
- ✅ One package.json to maintain
- ✅ Simplified testing with single Jest config
- ⏳ Faster development startup time (pending API migration)
- ⏳ Hot reload for both frontend and API changes (pending API migration)

### Functionality Preservation

- ⏳ All document parsing works identically (pending server migration)
- ⏳ Entity extraction maintains same accuracy (pending server migration)
- ⏳ UI/UX identical to current application (pending entity components)
- ✅ Test coverage remains high (35+ tests passing)
- ⏳ Performance matches current benchmarks (pending full migration)

### Infrastructure Simplification

- ✅ Eliminated monorepo complexity
- ✅ No more build orchestration scripts
- ⏳ Single deployment artifact (pending server migration)
- ⏳ Simplified CI/CD pipeline (pending completion)
- ✅ Reduced configuration files significantly

---

## � React Compiler Integration

### Why React Compiler for Your Project

- **Entity Management Optimization**: Your `EntityViewer`, `EntityCard`, and filtering components will benefit from automatic memoization
- **Complex State Updates**: Entity selection, filtering, and discard operations will be optimized automatically
- **Reduced Manual Optimization**: No need for manual `useMemo`/`useCallback` in entity-heavy components
- **Performance at Scale**: Large entity lists (100+ NPCs, locations, items) will render more efficiently

### React Compiler Setup

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    reactCompiler: true,
  },
  // Alternative: More granular control
  // experimental: {
  //   reactCompiler: {
  //     sources: (filename) => {
  //       // Only compile specific components that need optimization
  //       return filename.includes('src/components/Entity') || 
  //              filename.includes('src/hooks/useEntity')
  //     }
  //   }
  // }
}
```

### Components That Will Benefit Most

- **EntityViewer**: Complex filtering and selection logic
- **EntityCard**: Rendered in large lists, frequent re-renders
- **EntityFilters**: Search and filter state changes
- **useEntityFiltering**: Complex derived state calculations
- **useEntitySelection**: Selection state with entity arrays

---

## �📚 Key Next.js Patterns to Implement

### App Router Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Main application page  
│   └── api/
│       ├── health/route.ts # Health check endpoint
│       └── parse/route.ts  # Document parsing endpoint
├── components/            # All React components
├── hooks/                # Custom React hooks  
├── lib/                  # Server-side utilities and services
├── types/               # TypeScript definitions
└── styles/             # Global styles
```

### File Upload in Next.js

- Use `formData` in API routes instead of multer
- Handle file validation server-side
- Maintain existing file type/size restrictions

### API Route Pattern

```typescript
// src/app/api/parse/route.ts
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('document') as File
  // ... existing parsing logic
}
```

---

## 🚨 Migration Risks & Mitigations

### High Risk Items

1. **File Upload Handling**: Next.js handles files differently than multer
   - *Mitigation*: Implement thorough testing of file upload edge cases

2. **API Route Performance**: Ensure Next.js API routes perform as well as Express
   - *Mitigation*: Benchmark critical parsing operations  

3. **Entity Extraction Accuracy**: Complex NLP logic must work identically
   - *Mitigation*: Run comprehensive test suite against same test data

### Medium Risk Items

1. **Build Time**: Large dependencies (compromise, mammoth) might slow builds
   - *Mitigation*: Optimize imports, consider code splitting

2. **Memory Usage**: Next.js serverless functions have memory limits
   - *Mitigation*: Test with large files, configure appropriate limits

### Low Risk Items  

1. **CSS/Styling**: Well-isolated component styles should migrate cleanly
2. **React Components**: Modern React patterns should work identically
3. **TypeScript**: Existing types should require minimal changes

---

**Ready to escape infrastructure hell! 🔥→🏝️**

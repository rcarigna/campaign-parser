# Next.js Migration Checklist 🚀

**Goal**: Transform current monorepo (React + Vite + Express + Shared) into a unified Next.js application to eliminate infrastructure complexity while preserving all functionality.

## 📋 Migration Overview

### Current Pain Points to Solve

- [x] Multiple package.json files (4 total: root + client + server + shared)
- [x] Complex dev script orchestration with concurrently
- [x] Proxy configuration for API communication
- [x] Port management (3000 client, 3005 server, different environments)
- [x] Build coordination (shared → client → server dependencies)
- [x] Separate deployment artifacts
- [x] Jest configuration duplication
- [x] TypeScript config proliferation

### Target Architecture

- ✅ **Single Next.js app** with App Router
- ✅ **API Routes** replace Express server
- ✅ **Unified TypeScript** configuration
- ✅ **Single package.json** with all dependencies
- ✅ **Integrated testing** with single Jest config
- ✅ **One build command** for deployment
- ✅ **No proxy configuration** needed

---

## Phase 0: Backup

- [X] Move existing code into `obsidian-parser-vite-express` directory
- [X] Ensure it works from there

## Phase 1: Foundation Setup 🏗️

### 1.1 Create Next.js Application

- [X] Initialize new Next.js app with TypeScript: `npx create-next-app@latest obsidian-parser-nextjs --typescript --tailwind --app --src-dir`
- [X] Configure as sibling directory to current workspace
- [X] Set up proper `.gitignore` for Next.js
- [ ] Configure `next.config.js` for file uploads and API handling
- [ ] **Install React Compiler**: `npm install babel-plugin-react-compiler`
- [ ] **Configure React Compiler** in `next.config.js` for automatic memoization

### 1.2 Dependency Consolidation

- [ ] Merge all dependencies from client/server/shared packages into single `package.json`
- [ ] Client deps: `react`, `react-dom`, `axios`, `react-hot-toast`, `@testing-library/*`
- [ ] Server deps: `compromise`, `cors`, `express` → remove (using Next.js API), `gray-matter`, `mammoth`, `marked`, `multer`
- [ ] Dev deps: All TypeScript, Jest, ESLint configs consolidated
- [ ] Remove workspace references (`@obsidian-parser/shared`) since everything is now internal

### 1.3 TypeScript Configuration

- [ ] Single `tsconfig.json` with Next.js defaults
- [ ] Configure path aliases: `@/components/*`, `@/lib/*`, `@/types/*`
- [ ] Set up strict TypeScript with existing project settings
- [ ] Remove separate tsconfig files

---

## Phase 2: Code Migration 📦

### 2.1 Shared Types Integration

- [ ] Move `shared/src/types.ts` → `src/types/index.ts`
- [ ] Move `shared/src/campaign.ts` → `src/types/campaign.ts`
- [ ] Move `shared/src/document.ts` → `src/types/document.ts`
- [ ] Update all imports from `@obsidian-parser/shared` → `@/types`
- [ ] Ensure all entity types (`NPC`, `Location`, `Item`, etc.) are properly exported

### 2.2 Client Components Migration

- [ ] Move `client/src/components/` → `src/components/`
- [ ] Update component imports to use Next.js path aliases
- [ ] Migrate `Document/` components:
  - [ ] `FileUpload.tsx` - update for Next.js file handling
  - [ ] `ActionButtons.tsx` - maintain existing functionality
  - [ ] `ParsedResults.tsx` - update API calls to Next.js routes
- [ ] Migrate `Entity/` components:
  - [ ] `EntityViewer/` - preserve recent refactoring work
  - [ ] `EntityCard/` - maintain selection/display logic
  - [ ] `EntityGrid/` - keep existing layout system
  - [ ] `EntityFilters/` - preserve filtering functionality
- [ ] Migrate `Layout/` components for Next.js layout system

### 2.3 Hooks Migration

- [ ] Move `client/src/hooks/` → `src/hooks/`
- [ ] Update `useDocumentProcessor.ts`:
  - [ ] Change API calls from Express endpoints to Next.js API routes
  - [ ] Update file upload logic for Next.js
  - [ ] Preserve existing entity management functionality
- [ ] Update `useFileManager.ts`:
  - [ ] Adapt file validation for Next.js environment
  - [ ] Maintain existing file type/size checking
- [ ] Update all hook imports throughout components

### 2.4 Services Layer Migration

- [ ] Move `client/src/services/documentService.ts` → `src/lib/documentService.ts`
- [ ] Update API endpoints:
  - [ ] `/api/health` → `/api/health` (Next.js route)
  - [ ] `/api/parse` → `/api/parse` (Next.js route)
- [ ] Remove axios dependency in favor of fetch API
- [ ] Update error handling for Next.js patterns

---

## Phase 3: API Routes Creation 🔌

### 3.1 Health Check Endpoint

- [ ] Create `src/app/api/health/route.ts`
- [ ] Migrate logic from `server/src/routes/health.ts`
- [ ] Implement GET handler returning server status
- [ ] Test endpoint accessibility

### 3.2 Document Parser Endpoint

- [ ] Create `src/app/api/parse/route.ts`
- [ ] Set up Next.js file upload handling (replace multer)
- [ ] Migrate `server/src/routes/parse.ts` logic
- [ ] Import document parsing services
- [ ] Handle multipart/form-data in Next.js way
- [ ] Implement proper error responses

### 3.3 Entity Extraction Services

- [ ] Move `server/src/services/` → `src/lib/services/`
- [ ] Migrate `documentParser/`:
  - [ ] `documentParser.ts` - preserve Word/Markdown parsing
  - [ ] `parseMarkdown.ts` - maintain gray-matter + markdown-it logic
  - [ ] `parseWord.ts` - keep mammoth integration
- [ ] Migrate `entityExtractor/`:
  - [ ] `entityExtractor.ts` - preserve regex-based extraction
  - [ ] `nlpEntityExtractor.ts` - maintain compromise.js NLP logic
  - [ ] Keep campaign-specific dictionaries and patterns
- [ ] Update all internal imports to Next.js path structure

---

## Phase 4: Testing Migration 🧪

### 4.1 Jest Configuration

- [ ] Create single `jest.config.js` for Next.js
- [ ] Configure to test both components and API routes
- [ ] Set up `@testing-library/react` for component tests
- [ ] Configure coverage collection across entire app
- [ ] Set up test database/mocks as needed

### 4.2 Component Tests

- [ ] Move `client/src/**/*.test.tsx` → `src/**/*.test.tsx`
- [ ] Update imports in all test files
- [ ] Verify `EntityViewer`, `FileUpload`, `DocumentService` tests work
- [ ] Add tests for new Next.js API routes

### 4.3 API Route Tests  

- [ ] Move server tests to test Next.js API routes
- [ ] Update `parseDocumentHandler` tests for Next.js format
- [ ] Test entity extraction with Next.js request/response objects
- [ ] Ensure coverage matches current >70% threshold

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

## 🎯 Success Criteria

### Developer Experience Improvements

- ✅ Single `npm run dev` starts everything
- ✅ Single `npm run build` builds everything
- ✅ No more port conflicts or proxy issues
- ✅ One package.json to maintain
- ✅ Simplified testing with single Jest config
- ✅ Faster development startup time
- ✅ Hot reload for both frontend and API changes

### Functionality Preservation

- ✅ All document parsing works identically
- ✅ Entity extraction maintains same accuracy
- ✅ UI/UX identical to current application  
- ✅ Test coverage remains >90%
- ✅ Performance matches current benchmarks

### Infrastructure Simplification

- ✅ Eliminated monorepo complexity
- ✅ No more build orchestration scripts
- ✅ Single deployment artifact
- ✅ Simplified CI/CD pipeline
- ✅ Reduced configuration files from ~12 to ~3

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

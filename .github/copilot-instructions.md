<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization -->

## Project Overview

This is a simplified Next.js 16 application for campaign document parsing with clean architecture:

- **Architecture**: Next.js App Router with embedded business logic (no service layer)
- **Frontend**: React with TypeScript and Tailwind CSS
- **Backend**: Next.js API routes (/api/health, /api/parse, /api/export) with business logic
- **Functionality**: Upload documents (DOC/MD files), extract entities, manage duplicates, export to Obsidian
- **Testing**: 96 tests with comprehensive coverage using Jest and React Testing Library

## Development Guidelines

### Next.js Specific

- **Use App Router patterns** with Next.js 16 conventions
- **API Routes**: Business logic lives directly in API routes (no separate service layer)
- **Client HTTP**: Use simple HTTP utilities in src/client/ for API calls
- **Shared Utilities**: Pure functions in src/lib/ (client + server safe)
- **React Compiler**: Let React Compiler handle optimization automatically (no manual useMemo/useCallback)
- **Server Components**: Use server components where appropriate for better performance
- **Path Aliases**: Use @/ imports for clean module references (@/components, @/lib, @/types)

### Code Quality

- Follow TypeScript best practices for type safety
- Don't reinvent the wheel; leverage existing libraries for common tasks
- Use proper error handling for file uploads and API routes
- Focus on document parsing accuracy and user experience
- **Prefer arrow functions** over traditional function declarations
- **Prefer types over interfaces** where applicable
- **Prefer functional programming paradigms** where applicable
- **Use const** over let and var wherever possible
- **Use ES modules syntax** (import/export) throughout the codebase
- Follow KISS (Keep It Simple, Stupid) principle
- Write modular, testable, and reusable code
- Use conventional commits for commit messages

### Testing

- **Comprehensive Coverage**: Maintain 96+ test coverage with Jest
- **Component Testing**: Use React Testing Library for component tests
- **API Testing**: Mock NextRequest/NextResponse for API route tests
- **Hook Testing**: Test custom hooks with proper mocking (react-hot-toast, etc.)

### Entity Management

- **Deduplication System**: Use EntityMergeModal for duplicate entity resolution
- **Entity CRUD**: Leverage EntityViewer, EntityGrid, and EntityCard components
- **State Management**: Use custom hooks (useCampaignParser, useEntitySelection)
- **User Feedback**: Integrate react-hot-toast for user notifications

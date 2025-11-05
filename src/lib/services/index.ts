/**
 * Server-side services - Business logic orchestration
 *
 * ARCHITECTURAL NOTE:
 * - Services run ONLY on the server (API routes, server components)
 * - They orchestrate core modules (documentParser, entityExtractor, templateEngine)
 * - They contain business logic, not HTTP transport logic
 * - For client-side HTTP calls, use @/lib/clients instead
 *
 * DO NOT import this module in client-side code (React components, hooks)
 * Import services directly in API routes where needed:
 * import { exportEntities } from '@/lib/services/exportService';
 */

// Currently no exports to prevent accidental client-side imports
// Services are imported directly where needed in server-side code
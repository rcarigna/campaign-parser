import Handlebars from 'handlebars';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { AnyEntity } from '@/types';

// Template cache to avoid recompilation
const templateCache = new Map<string, HandlebarsTemplateDelegate>();
let helpersRegistered = false;

/**
 * Initialize Handlebars templates and helpers
 */
export const initializeTemplates = async (): Promise<void> => {
    if (templateCache.size > 0) return; // Already initialized

    const templatesPath = join(process.cwd(), 'src', 'lib', 'templateEngine', 'templates');
    const templateFiles = [
        'npc.md',
        'location.md',
        'item.md',
        'quest.md',
        'session-summary.md'
    ];

    // Load and compile templates
    await Promise.all(templateFiles.map(async (filename) => {
        const templatePath = join(templatesPath, filename);
        const templateSource = await readFile(templatePath, 'utf-8');
        const compiled = Handlebars.compile(templateSource);

        // Store by entity kind (remove .md extension)
        const entityKind = filename.replace('.md', '').replace('-', '_');
        templateCache.set(entityKind, compiled);
    }));

    // Register Handlebars helpers once
    if (!helpersRegistered) {
        registerHandlebarsHelpers();
        helpersRegistered = true;
    }
};

/**
 * Process a single entity into rendered markdown
 * Note: Templates must be initialized before calling this function
 */
export const processEntity = async (entity: AnyEntity): Promise<{ filename: string; content: string }> => {
    // Templates should already be initialized - no need to call initializeTemplates()
    if (templateCache.size === 0) {
        throw new Error('Templates not initialized. Call initializeTemplates() first.');
    }

    const templateKey = getTemplateKey(entity.kind);
    const template = templateCache.get(templateKey);

    if (!template) {
        throw new Error(`No template found for entity kind: ${entity.kind}`);
    }

    // Prepare template data
    const templateData = prepareTemplateData(entity);

    // Render the template
    const content = template(templateData);

    // Generate filename (sanitize for filesystem)
    const filename = generateFilename(entity);

    return { filename, content };
};

/**
 * Process multiple entities into rendered markdown files
 */
export const processEntities = async (entities: AnyEntity[]): Promise<Array<{ filename: string; content: string; kind: string }>> => {
    // Initialize templates once for the entire batch
    await initializeTemplates();

    const results = [];

    for (const entity of entities) {
        try {
            const processed = await processEntity(entity);
            results.push({
                ...processed,
                kind: entity.kind
            });
        } catch (error) {
            console.error(`Failed to process entity ${entity.title}:`, error);
            // Continue processing other entities
        }
    }

    return results;
};

/**
 * Get the template key for an entity kind
 */
const getTemplateKey = (kind: string): string => {
    const kindMap: Record<string, string> = {
        'npc': 'npc',
        'location': 'location',
        'item': 'item',
        'quest': 'quest',
        'session_summary': 'session-summary'
    };

    return kindMap[kind] || kind;
};

/**
 * Prepare template data with proper type safety
 */
const prepareTemplateData = (entity: AnyEntity): Record<string, unknown> => {
    // Handle sourceSessions array safely - entity.sourceSessions is readonly number[]
    const sourceSessions = entity.sourceSessions ? [...entity.sourceSessions] : [];
    const hasSourceSessions = sourceSessions.length > 0;

    return {
        ...entity,
        sourceSessions,
        hasSourceSessions
    };
};

/**
 * Generate a safe filename for the entity
 */
const generateFilename = (entity: AnyEntity): string => {
    let filename = entity.title;

    // Remove or replace problematic characters
    filename = filename
        .replace(/[<>:"/\\|?*]/g, '') // Remove illegal filename characters
        .replace(/\s+/g, ' ')         // Normalize whitespace
        .trim();

    return `${filename}.md`;
};

/**
 * Register custom Handlebars helpers for template processing
 */
const registerHandlebarsHelpers = (): void => {
    // Helper for conditional array rendering
    Handlebars.registerHelper('each_if_exists', function (context: unknown[], options: Handlebars.HelperOptions) {
        if (context && Array.isArray(context) && context.length > 0) {
            return context.map((item: unknown) => options.fn(item)).join('');
        }
        return '';
    });

    // Helper for array joining
    Handlebars.registerHelper('join', function (array: unknown[], separator: string = ', ') {
        if (Array.isArray(array)) {
            return array.join(separator);
        }
        return array;
    });

    // Helper for session reference formatting
    Handlebars.registerHelper('session_refs', function (sessions: number[]) {
        if (Array.isArray(sessions) && sessions.length > 0) {
            return sessions.join(', ');
        }
        return '';
    });

    // Helper for Obsidian wiki links
    Handlebars.registerHelper('wikilink', function (text: string) {
        return `[[${text}]]`;
    });
};
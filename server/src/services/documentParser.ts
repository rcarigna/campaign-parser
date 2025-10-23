import mammoth from 'mammoth';
import { marked } from 'marked';
import type {
    ParsedDocument,
    DocumentMetadata,
    WordDocumentContent,
    MarkdownContent,
    Heading,
    Link,
    Image
} from '@obsidian-parser/shared';

export const parseDocument = async (file: Express.Multer.File): Promise<ParsedDocument> => {
    const { originalname, mimetype, size, buffer } = file;

    let content: WordDocumentContent | MarkdownContent;
    let type: 'word_document' | 'markdown';

    try {
        if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimetype === 'application/msword') {
            // Parse DOC/DOCX files
            const result = await mammoth.convertToHtml({ buffer });
            content = {
                html: result.value,
                text: result.value.replace(/<[^>]*>/g, ''), // Strip HTML tags for plain text
                messages: result.messages,
                warnings: result.messages.filter(m => m.type === 'warning'),
                errors: result.messages.filter(m => m.type === 'error')
            };
            type = 'word_document';
        } else if (originalname.endsWith('.md') || mimetype === 'text/markdown' || mimetype === 'text/plain') {
            // Parse Markdown files
            const markdownText = buffer.toString('utf-8');
            const htmlContent = marked(markdownText);

            // Extract metadata if present (basic frontmatter parsing)
            const frontmatterMatch = markdownText.match(/^---\n(.*?)\n---/s);
            const metadata: Record<string, string> = {};
            let contentWithoutFrontmatter = markdownText;

            if (frontmatterMatch) {
                try {
                    // Simple YAML-like parsing for basic frontmatter
                    const frontmatterLines = frontmatterMatch[1].split('\n');
                    frontmatterLines.forEach(line => {
                        const colonIndex = line.indexOf(':');
                        if (colonIndex > 0) {
                            const key = line.substring(0, colonIndex).trim();
                            const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
                            metadata[key] = value;
                        }
                    });
                    contentWithoutFrontmatter = markdownText.replace(frontmatterMatch[0], '').trim();
                } catch (e) {
                    // If frontmatter parsing fails, just ignore it
                }
            }

            content = {
                raw: markdownText,
                html: htmlContent,
                text: contentWithoutFrontmatter,
                frontmatter: metadata,
                headings: extractHeadings(markdownText),
                links: extractLinks(markdownText),
                images: extractImages(markdownText)
            };
            type = 'markdown';
        } else {
            throw new Error(`Unsupported file type: ${mimetype}`);
        }

        return {
            filename: originalname,
            type,
            content,
            metadata: {
                size,
                mimeType: mimetype,
                lastModified: new Date()
            }
        };
    } catch (error: any) {
        throw new Error(`Failed to parse ${originalname}: ${error.message}`);
    }
}

const extractHeadings = (markdown: string): Heading[] => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Heading[] = [];
    let match: RegExpExecArray | null;

    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[1].length;
        const text = match[2].trim();
        const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
        headings.push({ level, text, id });
    }

    return headings;
};

const extractLinks = (markdown: string): Link[] => {
    const links: Link[] = [];

    // Inline links: [text](url)
    const inlineLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match: RegExpExecArray | null;

    while ((match = inlineLinkRegex.exec(markdown)) !== null) {
        links.push({
            text: match[1],
            url: match[2],
            type: 'inline' as const
        });
    }

    // Reference links: [text][ref] and [ref]: url
    const refLinkRegex = /\[([^\]]+)\]\[([^\]]+)\]/g;
    while ((match = refLinkRegex.exec(markdown)) !== null) {
        links.push({
            text: match[1],
            url: `[reference: ${match[2]}]`,
            type: 'reference' as const
        });
    }

    return links;
};

const extractImages = (markdown: string): Image[] => {
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)(?:\s+"([^"]*)")?\)/g;
    const images: Image[] = [];
    let match: RegExpExecArray | null;

    while ((match = imageRegex.exec(markdown)) !== null) {
        images.push({
            alt: match[1] || '',
            url: match[2],
            title: match[3] || undefined
        });
    }

    return images;
};
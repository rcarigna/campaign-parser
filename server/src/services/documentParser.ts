import mammoth from 'mammoth';
import { marked } from 'marked';
import { DocumentType, AllowedMimeType } from '@obsidian-parser/shared';
import type {
    ParsedDocument,
    DocumentMetadata,
    WordDocumentContent,
    MarkdownContent,
    Heading,
    Link,
    Image
} from '@obsidian-parser/shared';

type FileParsingResult = {
    content: WordDocumentContent | MarkdownContent;
    type: DocumentType;
};

const isWordDocument = (mimetype: string): boolean => {
    return mimetype === AllowedMimeType.DOCX ||
        mimetype === AllowedMimeType.DOC;
};

const isMarkdownDocument = (originalname: string, mimetype: string): boolean => {
    return originalname.endsWith('.md') ||
        mimetype === AllowedMimeType.MARKDOWN ||
        mimetype === 'text/plain';
};

const parseWordDocument = async (buffer: Buffer): Promise<WordDocumentContent> => {
    const result = await mammoth.convertToHtml({ buffer });

    return {
        html: result.value,
        text: result.value.replace(/<[^>]*>/g, ''), // Strip HTML tags for plain text
        messages: result.messages,
        warnings: result.messages.filter(m => m.type === 'warning'),
        errors: result.messages.filter(m => m.type === 'error')
    };
};

const parseFrontmatter = (markdownText: string): { metadata: Record<string, string>; contentWithoutFrontmatter: string } => {
    // Improved regex to handle whitespace around frontmatter delimiters, leading newlines, and indented delimiters
    const frontmatterMatch = markdownText.match(/(?:^|\n)\s*---\s*\n(.*?)\n\s*---\s*/s);
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

    return { metadata, contentWithoutFrontmatter };
};

const parseMarkdownDocument = (buffer: Buffer): MarkdownContent => {
    const markdownText = buffer.toString('utf-8');
    const htmlContent = marked(markdownText);
    const { metadata, contentWithoutFrontmatter } = parseFrontmatter(markdownText);

    return {
        raw: markdownText,
        html: htmlContent,
        text: contentWithoutFrontmatter,
        frontmatter: metadata,
        headings: extractHeadings(markdownText),
        links: extractLinks(markdownText),
        images: extractImages(markdownText)
    };
};

const createDocumentMetadata = (originalname: string, mimetype: string, size: number): DocumentMetadata => {
    return {
        size,
        mimeType: mimetype,
        lastModified: new Date()
    };
};

const parseFileContent = async (file: Express.Multer.File): Promise<FileParsingResult> => {
    const { originalname, mimetype, buffer } = file;

    if (isWordDocument(mimetype)) {
        const content = await parseWordDocument(buffer);
        return { content, type: DocumentType.WORD_DOCUMENT };
    }

    if (isMarkdownDocument(originalname, mimetype)) {
        const content = parseMarkdownDocument(buffer);
        return { content, type: DocumentType.MARKDOWN };
    }

    throw new Error(`Unsupported file type: ${mimetype}`);
};

export const parseDocument = async (file: Express.Multer.File): Promise<ParsedDocument> => {
    const { originalname, mimetype, size } = file;

    try {
        const { content, type } = await parseFileContent(file);
        const metadata = createDocumentMetadata(originalname, mimetype, size);

        return {
            filename: originalname,
            type,
            content,
            metadata
        };
    } catch (error: any) {
        throw new Error(`Failed to parse ${originalname}: ${error.message}`);
    }
};

const extractHeadings = (markdown: string): Heading[] => {
    // Improved regex to handle indented headings
    const headingRegex = /^(\s*)(#{1,6})\s+(.+)$/gm;
    const headings: Heading[] = [];
    let match: RegExpExecArray | null;

    while ((match = headingRegex.exec(markdown)) !== null) {
        const level = match[2].length; // match[2] is the ### part
        const text = match[3].trim(); // match[3] is the heading text
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
    // Improved regex to properly separate URL from title
    const imageRegex = /!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g;
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
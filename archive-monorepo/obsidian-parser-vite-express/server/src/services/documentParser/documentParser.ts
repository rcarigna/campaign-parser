import mammoth from 'mammoth';
import { marked } from 'marked';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
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
// import { extractEntities } from '../entityExtractor';

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

const parseFrontmatter = (markdownText: string): { metadata: Record<string, any>; contentWithoutFrontmatter: string } => {
    try {
        // Trim leading whitespace to handle indented frontmatter
        let cleanedText = markdownText.trim();

        // Check if frontmatter exists and fix indentation issues
        const frontmatterMatch = cleanedText.match(/^---\s*\n(.*?)\n\s*---/s);
        if (frontmatterMatch) {
            const frontmatterContent = frontmatterMatch[1];
            // Remove leading tabs/spaces from each line in the frontmatter
            const cleanedFrontmatter = frontmatterContent
                .split('\n')
                .map(line => line.replace(/^\s+/, ''))
                .join('\n');

            // Reconstruct the markdown with clean frontmatter
            cleanedText = `---\n${cleanedFrontmatter}\n---${cleanedText.substring(frontmatterMatch[0].length)}`;
        }

        const { data: metadata, content: contentWithoutFrontmatter } = matter(cleanedText);

        // Convert all values to strings to match expected behavior
        const stringifiedMetadata: Record<string, any> = {};
        Object.keys(metadata).forEach(key => {
            const value = metadata[key];
            if (value instanceof Date) {
                // Convert dates to ISO string format, then extract just the date part
                stringifiedMetadata[key] = value.toISOString().split('T')[0];
            } else {
                stringifiedMetadata[key] = String(value);
            }
        });

        return { metadata: stringifiedMetadata, contentWithoutFrontmatter };
    } catch (e) {
        // If frontmatter parsing fails, return original content with empty metadata
        return { metadata: {}, contentWithoutFrontmatter: markdownText };
    }
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

        // Extract entities for markdown documents
        // const entities = type === DocumentType.MARKDOWN && 'raw' in content
        //     ? extractEntities(content)
        //     : undefined;

        return {
            filename: originalname,
            type,
            content,
            // entities,
            metadata
        };
    } catch (error: any) {
        throw new Error(`Failed to parse ${originalname}: ${error.message}`);
    }
};

const extractHeadings = (markdown: string): Heading[] => {
    const headings: Heading[] = [];
    const lines = markdown.split('\n');

    for (const line of lines) {
        const trimmedLine = line.trim();
        const match = trimmedLine.match(/^(#{1,6})\s+(.+)$/);

        if (match) {
            const level = match[1].length;
            const text = match[2];
            const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            headings.push({ level, text, id });
        }
    }

    return headings;
};

const extractLinks = (markdown: string): Link[] => {
    const links: Link[] = [];

    // Inline links: [text](url) or [text](url "title")
    const inlineLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;

    while ((match = inlineLinkPattern.exec(markdown)) !== null) {
        const text = match[1];
        const urlAndTitle = match[2];

        links.push({
            text: text,
            url: urlAndTitle,
            type: 'inline' as const
        });
    }

    // Reference links: [text][ref]
    const referenceLinkPattern = /\[([^\]]+)\]\[([^\]]+)\]/g;
    while ((match = referenceLinkPattern.exec(markdown)) !== null) {
        const text = match[1];
        const ref = match[2];

        links.push({
            text: text,
            url: `[reference: ${ref}]`,
            type: 'reference' as const
        });
    }

    return links;
};

const extractImages = (markdown: string): Image[] => {
    const images: Image[] = [];

    // Image pattern: ![alt text](url) or ![alt text](url "title")
    const imagePattern = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;

    while ((match = imagePattern.exec(markdown)) !== null) {
        const alt = match[1];
        const urlAndTitle = match[2];

        // Check if there's a title in quotes
        const titleMatch = urlAndTitle.match(/^([^"]+)(?:\s+"([^"]+)")?$/);
        const url = titleMatch ? titleMatch[1].trim() : urlAndTitle;
        const title = titleMatch && titleMatch[2] ? titleMatch[2] : undefined;

        images.push({
            alt: alt,
            url: url,
            title: title
        });
    }

    return images;
};
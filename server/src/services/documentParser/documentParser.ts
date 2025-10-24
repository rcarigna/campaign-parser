import mammoth from 'mammoth';
import { marked } from 'marked';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';
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
    // Clean up indentation issues - remove leading whitespace from each line
    const cleanedMarkdown = markdown
        .split('\n')
        .map(line => line.replace(/^\s+/, ''))
        .join('\n');

    const md = new MarkdownIt();
    const tokens = md.parse(cleanedMarkdown, {});
    const headings: Heading[] = [];

    tokens.forEach((token, index) => {
        if (token.type === 'heading_open') {
            const level = parseInt(token.tag.substring(1)); // h1 -> 1, h2 -> 2, etc.
            const nextToken = tokens[index + 1];

            if (nextToken && nextToken.type === 'inline') {
                const text = nextToken.content;
                const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
                headings.push({ level, text, id });
            }
        }
    });

    return headings;
};

const extractLinks = (markdown: string): Link[] => {
    // Clean up indentation issues - remove leading whitespace from each line
    const cleanedMarkdown = markdown
        .split('\n')
        .map(line => line.replace(/^\s+/, ''))
        .join('\n');

    const md = new MarkdownIt();
    const tokens = md.parse(cleanedMarkdown, {});
    const links: Link[] = [];

    // First, detect reference link patterns in the original markdown to maintain type distinction
    const referenceLinkPattern = /\[([^\]]+)\]\[([^\]]+)\]/g;
    const referenceLinks: { text: string; ref: string }[] = [];
    let match;
    while ((match = referenceLinkPattern.exec(markdown)) !== null) {
        referenceLinks.push({ text: match[1], ref: match[2] });
    }

    // Process all tokens to find links within inline tokens
    tokens.forEach(token => {
        if (token.type === 'inline' && token.children) {
            token.children.forEach((child, index) => {
                if (child.type === 'link_open') {
                    const href = child.attrGet('href') || '';
                    const title = child.attrGet('title');
                    const nextChild = token.children![index + 1];

                    if (nextChild && nextChild.type === 'text') {
                        const text = nextChild.content;

                        // Check if this was originally a reference link
                        const isReferenceLink = referenceLinks.some(ref => ref.text === text);

                        if (isReferenceLink) {
                            const refLink = referenceLinks.find(ref => ref.text === text);
                            links.push({
                                text: text,
                                url: `[reference: ${refLink?.ref}]`,
                                type: 'reference' as const
                            });
                        } else {
                            // Inline link - reconstruct URL with title if present (for backward compatibility)
                            const url = title ? `${href} "${title}"` : href;
                            links.push({
                                text: text,
                                url: url,
                                type: 'inline' as const
                            });
                        }
                    }
                }
            });
        }
    });

    return links;
};

const extractImages = (markdown: string): Image[] => {
    // Clean up indentation issues - remove leading whitespace from each line
    const cleanedMarkdown = markdown
        .split('\n')
        .map(line => line.replace(/^\s+/, ''))
        .join('\n');

    const md = new MarkdownIt();
    const tokens = md.parse(cleanedMarkdown, {});
    const images: Image[] = [];

    // Process all tokens to find images within inline tokens
    tokens.forEach(token => {
        if (token.type === 'inline' && token.children) {
            token.children.forEach(child => {
                if (child.type === 'image') {
                    const src = child.attrGet('src') || '';
                    const alt = child.content || '';
                    const title = child.attrGet('title') || undefined;

                    images.push({
                        alt: alt,
                        url: src,
                        title: title
                    });
                }
            });
        }
    });

    return images;
};
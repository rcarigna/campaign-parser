import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { marked } from 'marked';

/**
 * GET /api/docs?file=filename
 * 
 * Serves documentation files as HTML, converting markdown to HTML
 * Supports: README.md, architecture.md, api-reference.md, ROADMAP.md
 */
export const GET = async (request: NextRequest) => {
    try {
        const { searchParams } = new URL(request.url);
        const file = searchParams.get('file');

        if (!file) {
            return NextResponse.json(
                {
                    error: 'Missing file parameter',
                    available: ['README.md', 'architecture.md', 'api-reference.md', 'ROADMAP.md']
                },
                { status: 400 }
            );
        }

        // Security: Only allow specific documentation files
        const allowedFiles = [
            'README.md',
            'architecture.md',
            'api-reference.md',
            'ROADMAP.md'
        ];

        const normalizedFile = file.endsWith('.md') ? file : `${file}.md`;

        if (!allowedFiles.includes(normalizedFile)) {
            return NextResponse.json(
                {
                    error: 'File not allowed',
                    requested: normalizedFile,
                    available: allowedFiles
                },
                { status: 403 }
            );
        }

        // Determine file path
        let filePath: string;
        if (normalizedFile === 'README.md') {
            filePath = path.join(process.cwd(), 'README.md');
        } else {
            filePath = path.join(process.cwd(), 'docs', normalizedFile);
        }

        // Read and process the markdown file
        const markdownContent = await fs.readFile(filePath, 'utf-8');

        // Convert markdown to HTML with GitHub-style rendering
        marked.setOptions({
            gfm: true,
            breaks: true
        });

        const htmlContent = marked(markdownContent);

        // Add basic styling for better presentation
        const styledHtml = `
      <div style="
        max-width: 800px;
        margin: 0 auto;
        padding: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
        line-height: 1.6;
        color: #24292f;
      ">
        <style>
          h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
            font-weight: 600;
            line-height: 1.25;
          }
          
          h1 { font-size: 2em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
          h2 { font-size: 1.5em; border-bottom: 1px solid #d0d7de; padding-bottom: 0.3em; }
          h3 { font-size: 1.25em; }
          
          pre {
            background-color: #f6f8fa;
            border-radius: 6px;
            padding: 16px;
            overflow: auto;
          }
          
          code {
            background-color: #f6f8fa;
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 85%;
          }
          
          pre code {
            background-color: transparent;
            padding: 0;
          }
          
          blockquote {
            padding: 0 1em;
            color: #656d76;
            border-left: 0.25em solid #d0d7de;
            margin: 0;
          }
          
          table {
            border-spacing: 0;
            border-collapse: collapse;
            width: 100%;
            margin: 16px 0;
          }
          
          table th, table td {
            padding: 6px 13px;
            border: 1px solid #d0d7de;
          }
          
          table th {
            background-color: #f6f8fa;
            font-weight: 600;
          }
          
          a {
            color: #0969da;
            text-decoration: none;
          }
          
          a:hover {
            text-decoration: underline;
          }
          
          ul, ol {
            padding-left: 2em;
          }
          
          .emoji {
            font-size: 1.2em;
          }
        </style>
        ${htmlContent}
      </div>
    `;

        return new NextResponse(styledHtml, {
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });

    } catch (error) {
        console.error('Documentation API error:', error);

        if (error instanceof Error && error.message.includes('ENOENT')) {
            return NextResponse.json(
                { error: 'Documentation file not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to load documentation' },
            { status: 500 }
        );
    }
};

/**
 * GET /api/docs (without file parameter)
 * 
 * Returns list of available documentation files
 */
export const runtime = 'nodejs';
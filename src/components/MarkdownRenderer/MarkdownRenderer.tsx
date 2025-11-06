'use client';

import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';
import { useEffect, useState } from 'react';

type MarkdownRendererProps = {
    markdown: string;
};

export const MarkdownRenderer = ({ markdown }: MarkdownRendererProps) => {
    const [html, setHtml] = useState<string>('');

    useEffect(() => {
        const parseMarkdown = async () => {
            const parsed = await marked.parse(markdown);
            const sanitized = DOMPurify.sanitize(parsed);
            setHtml(sanitized);
        };
        parseMarkdown();
    }, [markdown]);

    return (
        <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

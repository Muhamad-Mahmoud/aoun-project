'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { sanitizeUrl } from '@/lib/security/sanitize';
import { cn } from '@/shared/utils';

const sanitizeSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        // Allow target/rel/dir on links, class + dir on code blocks (styling hooks only — no event handlers).
        a: [...(defaultSchema.attributes?.a ?? []), ['target'], ['rel'], ['dir'], ['className']],
        code: [...(defaultSchema.attributes?.code ?? []), ['className'], ['dir']],
        pre: [...(defaultSchema.attributes?.pre ?? []), ['className'], ['dir']],
        span: [...(defaultSchema.attributes?.span ?? []), ['className'], ['dir']],
        div: [...(defaultSchema.attributes?.div ?? []), ['className'], ['dir']],
    },
};

/**
 * SafeMarkdown — the ONLY approved way to render Markdown/HTML from
 * AI output or user content.
 *
 * Layers:
 * 1. rehype-sanitize strips dangerous tags/attributes (script, iframe,
 *    on* handlers, style, form…).
 * 2. URL transform allow-lists href/src schemes (blocks javascript:/data:).
 * 3. Links open in a new tab with noopener/noreferrer.
 */
export function SafeMarkdown({ content, className }: { content: string; className?: string }) {
    return (
        <div className={className} dir="auto">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
                urlTransform={sanitizeUrl}
                components={{
                    a: ({ href, children }) => (
                        <a
                            href={sanitizeUrl(href)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary font-semibold underline underline-offset-2 decoration-primary/30 hover:decoration-primary/70 transition-colors"
                        >
                            {children}
                        </a>
                    ),
                    code: ({ children, className: codeClass }) => {
                        if (codeClass?.includes('language-')) {
                            return (
                                <pre className="my-3 p-3.5 rounded-xl bg-slate-950 text-slate-200 text-xs overflow-x-auto border border-slate-800" dir="ltr">
                                    <code className={cn('font-mono', codeClass)}>{children}</code>
                                </pre>
                            );
                        }
                        return (
                            <code className="px-1.5 py-0.5 rounded-md bg-muted text-foreground text-[12px] font-mono border border-border/60" dir="ltr">
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
}

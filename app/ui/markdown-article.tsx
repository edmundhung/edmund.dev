export function MarkdownArticle() {
  return ({ html }: { html: string }) => (
    <article
      innerHTML={html}
      className="markdown-content prose max-w-none prose-headings:text-primary prose-p:text-primary prose-a:text-primary prose-a:decoration-dash prose-a:underline-offset-4 prose-pre:overflow-x-auto prose-pre:px-4 prose-pre:py-4 prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none"
    />
  );
}

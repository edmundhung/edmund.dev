import type { ReactElement } from 'react';
import type { Components } from 'react-markdown';
import { PrismLight as ReactSyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import diff from 'react-syntax-highlighter/dist/cjs/languages/prism/diff';
import sh from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';

ReactSyntaxHighlighter.registerLanguage('ts', ts);
ReactSyntaxHighlighter.registerLanguage('tsx', tsx);
ReactSyntaxHighlighter.registerLanguage('diff', diff);
ReactSyntaxHighlighter.registerLanguage('sh', sh);

interface SyntaxHighlighterProps extends Components {
  language: string;
}

function SyntaxHighlighter({
  language,
  ...props
}: SyntaxHighlighterProps): ReactElement {
  return (
    <ReactSyntaxHighlighter
      useInlineStyles={false}
      showLineNumbers={language === 'tsx'}
      language={language}
      {...props}
    />
  );
}

export default SyntaxHighlighter;

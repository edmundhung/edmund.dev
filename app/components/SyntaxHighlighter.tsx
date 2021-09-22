import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import ReactSyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/prism-light';
import ts from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx';
import diff from 'react-syntax-highlighter/dist/cjs/languages/prism/diff';
import sh from 'react-syntax-highlighter/dist/cjs/languages/prism/bash';

ReactSyntaxHighlighter.registerLanguage('ts', ts);
ReactSyntaxHighlighter.registerLanguage('tsx', tsx);
ReactSyntaxHighlighter.registerLanguage('diff', diff);
ReactSyntaxHighlighter.registerLanguage('sh', sh);

type SyntaxHighlighterProps = ComponentPropsWithoutRef<
  typeof ReactSyntaxHighlighter
>;

function SyntaxHighlighter({
  language,
  useInlineStyles = false,
  showLineNumbers = language === 'tsx',
  ...props
}: SyntaxHighlighterProps): ReactElement {
  return (
    <ReactSyntaxHighlighter
      language={language}
      useInlineStyles={useInlineStyles}
      showLineNumbers={showLineNumbers}
      {...props}
    />
  );
}

export default SyntaxHighlighter;

import type { ReactElement } from 'react';
import type { Components } from 'react-markdown';
import { Light as ReactSyntaxHighlighter } from 'react-syntax-highlighter';
import ts from 'react-syntax-highlighter/dist/cjs/languages/hljs/typescript';
import diff from 'react-syntax-highlighter/dist/cjs/languages/hljs/diff';
import shell from 'react-syntax-highlighter/dist/cjs/languages/hljs/shell';
import github from 'react-syntax-highlighter/dist/cjs/styles/hljs/github';

ReactSyntaxHighlighter.registerLanguage('typescript', ts);
ReactSyntaxHighlighter.registerLanguage('diff', diff);
ReactSyntaxHighlighter.registerLanguage('shell', shell);

interface SyntaxHighlighterProps extends Components {
  language: string;
}

function SyntaxHighlighter({
  language,
  ...props
}: SyntaxHighlighterProps): ReactElement {
  return (
    <ReactSyntaxHighlighter
      style={github}
      showLineNumbers={language === 'tsx'}
      language={language}
      PreTag="div"
      wrapLongLines
      {...props}
    />
  );
}

export default SyntaxHighlighter;

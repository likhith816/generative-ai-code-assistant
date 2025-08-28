
import React from 'react';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <div className="bg-dark-bg rounded-md mt-2">
      <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono">
        <code className={`language-${language}`}>
          {code.replace(/\\n/g, '\n')}
        </code>
      </pre>
    </div>
  );
};

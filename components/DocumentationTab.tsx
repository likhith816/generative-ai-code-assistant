import React from 'react';
import type { DocumentationGenerated } from '../types';
import { Card } from './common/Card';
import { CodeBlock } from './common/CodeBlock';

interface DocumentationTabProps {
  documentation: DocumentationGenerated;
}

export const DocumentationTab: React.FC<DocumentationTabProps> = ({ documentation }) => {
  const highlightFunctionName = (signature: string, functionName: string) => {
    const regex = new RegExp(`\\b(${functionName})\\b`);
    return signature.replace(regex, `<span class="text-brand-blue font-bold">$1</span>`);
  };

  return (
    <div className="p-5 space-y-6">
      <Card title="Function Documentation">
        {documentation.function_docs.map((doc, index) => (
          <div key={index} className="py-4 border-b border-dark-border last:border-b-0">
            <h4 className="text-md font-semibold font-mono text-dark-text mb-2">{doc.function_name}</h4>
            
            {doc.signature && (
              <div className="mb-4">
                <h5 className="text-sm font-semibold text-dark-text-secondary mb-1 uppercase tracking-wider">Signature</h5>
                <div className="bg-dark-bg rounded-md mt-2">
                  <pre className="p-4 text-sm text-gray-300 overflow-x-auto font-mono">
                    <code dangerouslySetInnerHTML={{ __html: highlightFunctionName(doc.signature, doc.function_name) }} />
                  </pre>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="text-sm font-semibold text-dark-text mb-2 uppercase tracking-wider">Description</h5>
              <CodeBlock code={doc.docstring} language="python" />
            </div>

            {doc.generated_examples && doc.generated_examples.length > 0 && (
                <div className="mt-6">
                    <h5 className="text-sm font-semibold text-dark-text mb-2 uppercase tracking-wider">Generated Examples</h5>
                    <div className="space-y-4 mt-2">
                        {doc.generated_examples.map((example, i) => (
                            <CodeBlock key={i} code={example} language="python" />
                        ))}
                    </div>
                </div>
            )}

            <div className="flex space-x-4 mt-4 text-sm">
                <span className="text-dark-text-secondary">Complexity Score: <span className="font-bold text-dark-text">{doc.complexity_score}</span></span>
            </div>
          </div>
        ))}
      </Card>
      
      <Card title="API Documentation (OpenAPI)">
        <div className="space-y-2 text-sm p-2">
            <div className="flex justify-between py-1"><span>Version:</span> <span className="font-mono">{documentation.api_documentation.openapi_version}</span></div>
            <div className="flex justify-between py-1"><span>Endpoints:</span> <span className="font-mono">{documentation.api_documentation.endpoints_documented}</span></div>
            <div className="flex justify-between py-1"><span>Schemas:</span> <span className="font-mono">{documentation.api_documentation.schemas_generated}</span></div>
            <div className="flex justify-between py-1"><span>Example Requests:</span> <span className="font-mono">{documentation.api_documentation.example_requests ? 'Yes' : 'No'}</span></div>
        </div>
      </Card>
    </div>
  );
};
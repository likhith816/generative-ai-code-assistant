import React from 'react';
import type { ReadmeSections } from '../types';
import { Card } from './common/Card';
import { CodeBlock } from './common/CodeBlock';

interface ReadmeTabProps {
  readme: ReadmeSections;
}

export const ReadmeTab: React.FC<ReadmeTabProps> = ({ readme }) => {
  return (
    <div className="p-5 space-y-6">
      <Card title="Overview">
        <p className="text-dark-text-secondary leading-relaxed">{readme.overview}</p>
      </Card>
      <Card title="Installation">
        <CodeBlock code={readme.installation} language="sh" />
      </Card>
      <Card title="Usage">
        <CodeBlock code={readme.usage} language="sh" />
      </Card>
      <Card title="API Reference">
        <p className="text-dark-text-secondary leading-relaxed">{readme.api_reference}</p>
      </Card>
    </div>
  );
};

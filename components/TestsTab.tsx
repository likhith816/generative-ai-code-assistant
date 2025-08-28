
import React from 'react';
import type { TestsGenerated } from '../types';
import { Card } from './common/Card';
import { CodeBlock } from './common/CodeBlock';

interface TestsTabProps {
  tests: TestsGenerated;
}

const TestMetric: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
    <div className="flex justify-between p-3 bg-dark-bg rounded-md">
        <span className="text-dark-text-secondary">{label}</span>
        <span className="font-bold font-mono text-brand-blue">{value}</span>
    </div>
);


export const TestsTab: React.FC<TestsTabProps> = ({ tests }) => {
  return (
    <div className="p-5 space-y-6">
      <Card title="Test Generation Summary">
        <div className="grid grid-cols-2 gap-4">
            <TestMetric label="Total Coverage" value={`${(tests.total_coverage * 100).toFixed(1)}%`} />
            <TestMetric label="Mutation Score" value={tests.mutation_score} />
            <TestMetric label="Integration Tests" value={tests.integration_tests} />
            <TestMetric label="Property Tests" value={tests.property_tests} />
        </div>
      </Card>

      <Card title="Generated Unit Tests">
        <div className="space-y-6">
          {tests.unit_tests.map((test, index) => (
            <div key={index} className="border-b border-dark-border pb-4 last:border-b-0">
              <h4 className="text-md font-semibold font-mono text-brand-blue mb-2">{test.test_name}</h4>
              <CodeBlock code={test.test_code} language="python" />
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm items-center">
                  <span className="text-dark-text-secondary">Coverage Impact: <span className="font-semibold text-green-400">{test.coverage_impact}</span></span>
                  <div className="text-dark-text-secondary">
                    Edge Cases:
                    <div className="inline-flex flex-wrap gap-2 ml-2">
                        {test.edge_cases_covered.map(ec => (
                            <span key={ec} className="text-xs bg-gray-700 text-gray-200 px-2 py-1 rounded-full font-mono">{ec}</span>
                        ))}
                    </div>
                  </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

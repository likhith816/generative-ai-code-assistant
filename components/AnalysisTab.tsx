
import React from 'react';
import type { CodeAnalysis } from '../types';
import { Card } from './common/Card';

interface AnalysisTabProps {
  analysis: CodeAnalysis;
}

const MetricItem: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="flex justify-between items-center py-2">
    <span className="text-dark-text-secondary">{label}</span>
    <span className="font-mono text-brand-blue font-bold">{value}</span>
  </div>
);

const DependencyList: React.FC<{ title: string, items: string[] }> = ({ title, items }) => (
    <div>
        <h4 className="text-md font-semibold text-dark-text mb-2">{title}</h4>
        <div className="flex flex-wrap gap-2">
            {items.map(item => (
                <span key={item} className="bg-gray-700 text-gray-200 text-xs font-mono px-2 py-1 rounded-full">{item}</span>
            ))}
        </div>
    </div>
);

export const AnalysisTab: React.FC<AnalysisTabProps> = ({ analysis }) => {
  return (
    <div className="p-5 space-y-6">
      <Card title="File Overview">
        <div className="divide-y divide-dark-border">
            <MetricItem label="File Path" value={analysis.file_path} />
            <MetricItem label="Language" value={analysis.language} />
        </div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Code Metrics">
          <div className="divide-y divide-dark-border">
            <MetricItem label="Lines of Code" value={analysis.metrics.lines_of_code} />
            <MetricItem label="Cyclomatic Complexity" value={analysis.metrics.cyclomatic_complexity} />
            <MetricItem label="Maintainability Index" value={analysis.metrics.maintainability_index.toFixed(1)} />
            <MetricItem label="Test Coverage" value={`${(analysis.metrics.test_coverage * 100).toFixed(1)}%`} />
          </div>
        </Card>
        <Card title="AST Summary">
            <div className="divide-y divide-dark-border">
                <MetricItem label="Classes" value={analysis.ast_summary.classes} />
                <MetricItem label="Functions" value={analysis.ast_summary.functions} />
            </div>
             <div className="mt-4">
                <h4 className="text-md font-semibold text-dark-text mb-2">Complexity Hotspots</h4>
                <div className="flex flex-wrap gap-2">
                    {analysis.ast_summary.complexity_hotspots.map(spot => (
                        <span key={spot} className="bg-red-900/50 text-red-300 text-xs font-mono px-2 py-1 rounded-full">{spot}</span>
                    ))}
                </div>
            </div>
        </Card>
      </div>
      
      <Card title="Dependencies">
        <div className="space-y-4">
            <DependencyList title="Internal" items={analysis.dependencies.internal} />
            <DependencyList title="External" items={analysis.dependencies.external} />
        </div>
      </Card>
    </div>
  );
};

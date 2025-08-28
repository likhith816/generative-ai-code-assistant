
import React, { useState } from 'react';
import { AnalysisTab } from './AnalysisTab';
import { DocumentationTab } from './DocumentationTab';
import { TestsTab } from './TestsTab';
import { QATab } from './QATab';
import { ReadmeTab } from './ReadmeTab';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { CodeIcon } from './icons/CodeIcon';
import { DocumentIcon } from './icons/DocumentIcon';
import { TestIcon } from './icons/TestIcon';
import { ChatIcon } from './icons/ChatIcon';
import { BookIcon } from './icons/BookIcon';
import type { CodeAnalysisResult, ChatEntry } from '../types';
import { Tab } from '../constants';

interface ResultsDisplayProps {
  result: CodeAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  chatHistory: ChatEntry[];
  isChatLoading: boolean;
  onAskFollowUp: (question: string) => void;
}

const TABS = [
  { name: Tab.Analysis, icon: CodeIcon },
  { name: Tab.Documentation, icon: DocumentIcon },
  { name: Tab.README, icon: BookIcon },
  { name: Tab.Tests, icon: TestIcon },
  { name: Tab.QA, icon: ChatIcon },
];

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading, error, chatHistory, isChatLoading, onAskFollowUp }) => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Analysis);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
          <SpinnerIcon className="h-12 w-12 text-brand-blue" />
          <p className="mt-4 text-lg font-semibold text-dark-text">Analyzing Code...</p>
          <p className="text-dark-text-secondary">The AI is parsing, documenting, and testing your code. Please wait.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full p-8 text-center text-red-400">
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-300">Analysis Failed</h3>
            <p className="mt-2 text-red-400">{error}</p>
          </div>
        </div>
      );
    }

    if (!result) {
      return (
        <div className="flex items-center justify-center h-full p-8 text-center">
          <p className="text-dark-text-secondary">Results will be displayed here once analysis is complete.</p>
        </div>
      );
    }

    switch (activeTab) {
      case Tab.Analysis:
        return <AnalysisTab analysis={result.code_analysis} />;
      case Tab.Documentation:
        return <DocumentationTab documentation={result.documentation_generated} />;
      case Tab.README:
        return <ReadmeTab readme={result.documentation_generated.readme_sections} />;
      case Tab.Tests:
        return <TestsTab tests={result.tests_generated} />;
      case Tab.QA:
        return <QATab 
            chatHistory={chatHistory} 
            isChatLoading={isChatLoading} 
            onAskFollowUp={onAskFollowUp}
            initialAnalysisDone={!!result}
         />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-dark-bg-secondary border border-dark-border rounded-lg shadow-lg">
      <div className="border-b border-dark-border">
        <nav className="flex space-x-1 p-2" aria-label="Tabs">
          {TABS.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`${
                activeTab === tab.name
                  ? 'bg-brand-blue/20 text-brand-blue'
                  : 'text-dark-text-secondary hover:text-dark-text hover:bg-white/5'
              } group flex items-center px-4 py-2 font-medium text-sm rounded-md transition-colors`}
            >
              <tab.icon className="-ml-0.5 mr-2 h-5 w-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-grow p-1 overflow-y-auto flex flex-col">
        {renderContent()}
      </div>
    </div>
  );
};
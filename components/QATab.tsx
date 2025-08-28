
import React, { useState, useRef, useEffect } from 'react';
import type { QueryResponse, ChatEntry } from '../types';
import { SendIcon } from './icons/SendIcon';
import { Card } from './common/Card';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface QATabProps {
  chatHistory: ChatEntry[];
  isChatLoading: boolean;
  onAskFollowUp: (question: string) => void;
  initialAnalysisDone: boolean;
}

interface AiResponseProps {
  data: QueryResponse;
  isError?: boolean;
}

const AiResponse: React.FC<AiResponseProps> = ({ data, isError }) => {
  if (isError) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-lg space-y-2">
        <h4 className="font-semibold text-red-300">An Error Occurred</h4>
        <p className="text-red-400">{data.response}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {/* Main response block */}
      <div className="p-4 bg-dark-bg rounded-lg space-y-4">
          <div>
              <p className="text-sm font-semibold text-dark-text-secondary">AI RESPONSE TO: "{data.query}"</p>
              <p className="mt-2 text-dark-text leading-relaxed whitespace-pre-wrap">{data.response}</p>
              <div className="mt-3 text-sm">
                  <span className="text-dark-text-secondary">Confidence: </span>
                  <span className="font-bold text-green-400">{(data.confidence_score * 100).toFixed(0)}%</span>
              </div>
          </div>

          {data.code_references.length > 0 && (
              <div>
                  <h4 className="text-md font-semibold text-dark-text mb-2">Code References</h4>
                  {data.code_references.map((ref, index) => (
                      <div key={index} className="p-3 bg-dark-bg-secondary/50 rounded-md border border-dark-border text-sm">
                          <p className="font-mono text-brand-blue">{ref.file}:{ref.lines}</p>
                          <p className="text-dark-text-secondary mt-1">Relevance: <span className="font-bold text-dark-text">{(ref.relevance_score * 100).toFixed(0)}%</span></p>
                      </div>
                  ))}
              </div>
          )}
      </div>
      
      {/* Suggested Improvements block */}
      {data.suggested_improvements.length > 0 && (
        <Card title="Actionable Insights: Suggested Improvements">
          <ul className="space-y-3">
            {data.suggested_improvements.map((imp, index) => (
              <li key={index} className="flex items-start gap-3 text-sm">
                <LightbulbIcon className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <span className="text-dark-text">{imp}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
};

const UserMessage: React.FC<{ text: string }> = ({ text }) => (
    <div className="p-4 bg-blue-900/40 border border-blue-500/50 rounded-lg">
         <p className="text-sm font-semibold text-blue-300">YOUR QUESTION</p>
         <p className="mt-1 text-dark-text whitespace-pre-wrap">{text}</p>
    </div>
);

export const QATab: React.FC<QATabProps> = ({ chatHistory, isChatLoading, onAskFollowUp, initialAnalysisDone }) => {
  const [question, setQuestion] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isChatLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim()) {
        onAskFollowUp(question);
        setQuestion('');
    }
  };
  
  return (
    <div className="flex flex-col h-full">
        <div className="flex flex-col gap-6 flex-grow p-5 overflow-y-auto">
            {chatHistory.map((entry, index) => (
                <div key={index} className={`flex w-full ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="w-full max-w-xl lg:max-w-2xl">
                        {entry.type === 'user' ? (
                            <UserMessage text={entry.text} />
                        ) : (
                            <AiResponse data={entry.data} isError={entry.isError} />
                        )}
                    </div>
                </div>
            ))}
             {isChatLoading && (
                <div className="flex justify-start">
                    <div className="flex items-center gap-3 p-4">
                        <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-brand-blue rounded-full animate-pulse [animation-delay:0.4s]"></div>
                        <span className="text-sm text-dark-text-secondary">AI is thinking...</span>
                    </div>
                </div>
            )}
            <div ref={chatEndRef} />
        </div>
        {initialAnalysisDone && (
             <div className="p-4 border-t border-dark-border bg-dark-bg-secondary">
                <form onSubmit={handleSubmit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a follow-up question..."
                        disabled={isChatLoading}
                        className="w-full p-3 bg-dark-bg border border-dark-border rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue text-dark-text placeholder-dark-text-secondary disabled:opacity-50"
                        aria-label="Follow-up question"
                    />
                    <button
                        type="submit"
                        disabled={isChatLoading || !question.trim()}
                        className="p-3 bg-brand-blue text-white rounded-md hover:bg-sky-500 disabled:bg-brand-gray disabled:cursor-not-allowed transition-colors"
                        aria-label="Send question"
                    >
                        <SendIcon className="h-6 w-6"/>
                    </button>
                </form>
            </div>
        )}
    </div>
  );
};
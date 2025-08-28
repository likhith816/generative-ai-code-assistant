import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CodeInput } from './components/CodeInput';
import { ResultsDisplay } from './components/ResultsDisplay';
import { analyzeCodeWithGemini, askFollowUpQuestion } from './services/geminiService';
import type { CodeAnalysisResult, ChatEntry } from './types';
import { SAMPLE_CODE } from './constants';

const App: React.FC = () => {
  const [code, setCode] = useState<string>(SAMPLE_CODE);
  const [analysisResult, setAnalysisResult] = useState<CodeAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatEntry[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const handleAnalyzeClick = useCallback(async () => {
    if (!code.trim()) {
      setError("Please enter some code to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setChatHistory([]); // Reset chat history

    try {
      const result = await analyzeCodeWithGemini(code);
      setAnalysisResult(result);
      if (result.query_response) {
        setChatHistory([{ type: 'ai', data: result.query_response }]);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred. Please check the console.");
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  const handleAskFollowUp = useCallback(async (question: string) => {
    if (!question.trim() || isChatLoading) return;

    const userMessage: ChatEntry = { type: 'user', text: question };
    setChatHistory(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const aiResponseData = await askFollowUpQuestion(code, question, chatHistory);
      const aiMessage: ChatEntry = { type: 'ai', data: aiResponseData };
      setChatHistory(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: ChatEntry = {
          type: 'ai',
          data: {
              query: question,
              response: "Sorry, I couldn't process that request. Please try again.",
              code_references: [],
              suggested_improvements: [],
              confidence_score: 0
          },
          isError: true,
      };
      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  }, [code, chatHistory, isChatLoading]);


  return (
    <div className="min-h-screen bg-dark-bg text-dark-text font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/2 flex flex-col">
          <CodeInput
            code={code}
            setCode={setCode}
            onAnalyze={handleAnalyzeClick}
            isLoading={isLoading}
          />
        </div>
        <div className="lg:w-1/2 flex flex-col">
          <ResultsDisplay
            result={analysisResult}
            isLoading={isLoading}
            error={error}
            chatHistory={chatHistory}
            isChatLoading={isChatLoading}
            onAskFollowUp={handleAskFollowUp}
          />
        </div>
      </main>
    </div>
  );
};

export default App;

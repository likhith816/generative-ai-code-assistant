import React, { useRef, useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface CodeInputProps {
  code: string;
  setCode: (code: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

export const CodeInput: React.FC<CodeInputProps> = ({ code, setCode, onAnalyze, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        setCode(text);
      }
    };
    reader.onerror = (e) => {
        console.error("Failed to read file", e);
        setFileName(null);
    }
    reader.readAsText(file);
    // Clear the input value to allow re-uploading the same file
    event.target.value = '';
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value);
    setFileName(null);
  }

  return (
    <div className="flex flex-col h-full bg-dark-bg-secondary border border-dark-border rounded-lg shadow-lg">
      <div className="p-4 border-b border-dark-border">
        <h2 className="text-lg font-semibold text-dark-text">Code Input</h2>
        <p className="text-sm text-dark-text-secondary">Paste your code below or upload a file.</p>
      </div>
      <div className="flex-grow p-4">
        <textarea
          value={code}
          onChange={handleTextChange}
          placeholder="Enter your code here..."
          className="w-full h-full p-3 bg-dark-bg border border-dark-border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-brand-blue font-mono text-sm leading-relaxed text-dark-text"
          style={{ minHeight: '400px' }}
        />
      </div>
      <div className="p-4 border-t border-dark-border flex items-center gap-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".py,.js,.jsx,.ts,.tsx,.java,.go,.rs,.html,.css,.json,.md"
        />
        <button 
            onClick={handleUploadClick} 
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-3 bg-dark-bg border border-dark-border text-dark-text font-bold rounded-md hover:bg-dark-border disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
            aria-label="Upload a code file"
        >
            <UploadIcon className="h-5 w-5" />
            <span>Upload File</span>
        </button>
        {fileName && (
          <div className="flex-shrink min-w-0">
            <p className="text-sm text-dark-text-secondary font-mono bg-dark-bg px-2 py-1 rounded truncate" title={fileName}>
              {fileName}
            </p>
          </div>
        )}
        <button
          onClick={onAnalyze}
          disabled={isLoading}
          className="flex-grow flex justify-center items-center px-4 py-3 bg-brand-blue text-white font-bold rounded-md hover:bg-sky-500 disabled:bg-brand-gray disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze Code'
          )}
        </button>
      </div>
    </div>
  );
};
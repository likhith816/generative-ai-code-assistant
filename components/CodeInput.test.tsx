
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // Assumes this is setup
// FIX: Import test runner globals from vitest to resolve 'Cannot find name' errors.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { CodeInput } from './CodeInput';

// Mock child icon components to isolate the test to CodeInput
vi.mock('./icons/UploadIcon', () => ({
  UploadIcon: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="upload-icon" {...props} />,
}));

describe('CodeInput', () => {
  const mockSetCode = vi.fn();
  const mockOnAnalyze = vi.fn();

  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render correctly with initial props', () => {
    render(
      <CodeInput
        code="initial code"
        setCode={mockSetCode}
        onAnalyze={mockOnAnalyze}
        isLoading={false}
      />
    );
    expect(screen.getByText('Code Input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter your code here...')).toHaveValue('initial code');
    expect(screen.getByRole('button', { name: /upload file/i })).toBeEnabled();
    expect(screen.getByRole('button', { name: /analyze code/i })).toBeEnabled();
  });

  it('should call setCode when user types in the textarea', () => {
    render(
      <CodeInput
        code=""
        setCode={mockSetCode}
        onAnalyze={mockOnAnalyze}
        isLoading={false}
      />
    );
    const textarea = screen.getByPlaceholderText('Enter your code here...');
    fireEvent.change(textarea, { target: { value: 'new user code' } });
    expect(mockSetCode).toHaveBeenCalledWith('new user code');
  });

  it('should call onAnalyze when the analyze button is clicked', () => {
    render(
      <CodeInput
        code="some code"
        setCode={mockSetCode}
        onAnalyze={mockOnAnalyze}
        isLoading={false}
      />
    );
    const analyzeButton = screen.getByRole('button', { name: /analyze code/i });
    fireEvent.click(analyzeButton);
    expect(mockOnAnalyze).toHaveBeenCalledTimes(1);
  });

  it('should disable buttons and show loading text when isLoading is true', () => {
    render(
      <CodeInput
        code=""
        setCode={mockSetCode}
        onAnalyze={mockOnAnalyze}
        isLoading={true}
      />
    );
    expect(screen.getByRole('button', { name: /upload file/i })).toBeDisabled();
    const analyzeButton = screen.getByRole('button', { name: /analyzing/i });
    expect(analyzeButton).toBeDisabled();
    expect(screen.getByText('Analyzing...')).toBeInTheDocument();
  });

  describe('File Upload', () => {
    const originalFileReader = window.FileReader;

    afterEach(() => {
      window.FileReader = originalFileReader; // Restore original FileReader
    });

    it('should update code state when a file is successfully uploaded', async () => {
      const fileContent = 'const fileContent = "hello";';
      const file = new File([fileContent], 'test.js', { type: 'text/javascript' });

      // Mock FileReader to simulate a successful read
      window.FileReader = vi.fn(() => ({
        readAsText: vi.fn().mockImplementation(function(this: any) {
          if (this.onload) {
            const event = { target: { result: fileContent } };
            this.onload(event);
          }
        }),
        onerror: null,
        onload: null,
      })) as any;

      render(
        <CodeInput
          code=""
          setCode={mockSetCode}
          onAnalyze={mockOnAnalyze}
          isLoading={false}
        />
      );

      const uploadButton = screen.getByRole('button', { name: 'Upload a code file' });
      const fileInput = uploadButton.previousElementSibling as HTMLInputElement;

      // Simulate file selection
      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(mockSetCode).toHaveBeenCalledWith(fileContent);
      });
      
      // Verify the input value is cleared to allow re-uploading the same file
      expect(fileInput.value).toBe('');
    });

    it('should log an error if file reading fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const errorEvent = new ProgressEvent('error');

      // Mock FileReader to simulate a read error
      window.FileReader = vi.fn(() => ({
        readAsText: vi.fn().mockImplementation(function(this: any) {
          if (this.onerror) {
            this.onerror(errorEvent);
          }
        }),
        onload: null,
        onerror: null,
      })) as any;

      const file = new File([''], 'error.js', { type: 'text/javascript' });

      render(
        <CodeInput
          code=""
          setCode={mockSetCode}
          onAnalyze={mockOnAnalyze}
          isLoading={false}
        />
      );

      const uploadButton = screen.getByRole('button', { name: 'Upload a code file' });
      const fileInput = uploadButton.previousElementSibling as HTMLInputElement;

      fireEvent.change(fileInput, { target: { files: [file] } });

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith("Failed to read file", expect.any(Event));
      });

      expect(mockSetCode).not.toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });
});

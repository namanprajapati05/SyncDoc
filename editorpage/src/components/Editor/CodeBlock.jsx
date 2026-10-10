import React, { useState, useRef, useEffect } from 'react';
import BlockToolbar from './BlockToolbar';
import {
  CodeIcon,
  PlayIcon,
  CopyIcon,
  CheckIcon,
  TerminalIcon,
  CloseIcon
} from '../common/Icons';
import './CodeBlock.css';

const SUPPORTED_LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', defaultComment: '// JavaScript Code' },
  { id: 'python', label: 'Python', defaultComment: '# Python Code' },
  { id: 'java', label: 'Java', defaultComment: '// Java Code' },
  { id: 'c', label: 'C', defaultComment: '/* C Code */' },
  { id: 'cpp', label: 'C++', defaultComment: '// C++ Code' },
  { id: 'html', label: 'HTML', defaultComment: '<!-- HTML Code -->' },
  { id: 'css', label: 'CSS', defaultComment: '/* CSS Styles */' },
];

/**
 * CodeBlock component provides a code editor cell with line numbers,
 * language selector, copy button, simulated run button, and output display.
 */
export default function CodeBlock({
  block,
  onUpdate,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  isSelected,
  onSelect
}) {
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(block.output || null);
  const [executionTime, setExecutionTime] = useState(block.executionTime || null);

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);

  // Compute line numbers from content
  const lines = (block.content || '').split('\n');
  const lineCount = Math.max(lines.length, 1);

  // Sync scrolling between textarea and line numbers gutter
  const handleScroll = (e) => {
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = e.target.scrollTop;
    }
  };

  // Handle Tab key to insert 2 spaces
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const value = textarea.value;

      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onUpdate(block.id, { content: newValue });

      // Move cursor after the inserted spaces
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
  };

  const handleContentChange = (e) => {
    onUpdate(block.id, { content: e.target.value });
  };

  const handleLanguageChange = (e) => {
    onUpdate(block.id, { language: e.target.value });
  };

  // Copy code to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(block.content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  // Simulate Run Execution
  const handleRun = () => {
    setIsRunning(true);

    setTimeout(() => {
      setIsRunning(false);
      const simulatedTime = (Math.random() * 0.2 + 0.05).toFixed(2);
      setExecutionTime(simulatedTime);

      // Generate a simulated placeholder output based on code content & language
      const codeText = block.content || '';
      let simulatedOutput = '';

      if (block.language === 'python') {
        const printMatches = [...codeText.matchAll(/print\((?:['"`](.*?)['"`]|(.*?))\)/g)];
        if (printMatches.length > 0) {
          simulatedOutput = printMatches.map(m => m[1] || m[2]).join('\n');
        } else {
          simulatedOutput = `[SyncDoc Python 3.11 Runtime]\n>>> Execution completed.\n>>> Return code: 0`;
        }
      } else if (block.language === 'javascript') {
        const logMatches = [...codeText.matchAll(/console\.log\((?:['"`](.*?)['"`]|(.*?))\)/g)];
        if (logMatches.length > 0) {
          simulatedOutput = logMatches.map(m => m[1] || m[2]).join('\n');
        } else {
          simulatedOutput = `[Node.js v20.x Execution Environment]\nProcess finished with exit code 0`;
        }
      } else if (block.language === 'html') {
        simulatedOutput = `[HTML Preview Mode]\nDOM nodes parsed: 12 elements rendered successfully.`;
      } else {
        simulatedOutput = `[${block.language?.toUpperCase() || 'CODE'} Compiler]\nCompiled successfully. 0 errors, 0 warnings.\nOutput: Program returned 0`;
      }

      setOutput(simulatedOutput);
      onUpdate(block.id, { output: simulatedOutput, executionTime: simulatedTime });
    }, 450);
  };

  const handleClearOutput = () => {
    setOutput(null);
    setExecutionTime(null);
    onUpdate(block.id, { output: null, executionTime: null });
  };

  return (
    <div
      className={`syncdoc-block syncdoc-code-block ${isSelected ? 'is-active' : ''}`}
      onClick={onSelect}
    >
      {/* Code Block Header */}
      <div className="syncdoc-block-header syncdoc-code-header">
        <div className="syncdoc-code-header-left">
          <div className="syncdoc-block-tag code-tag">
            <CodeIcon size={14} />
            <span>Code Block</span>
          </div>

          {/* Language Selector */}
          <div className="syncdoc-lang-selector-wrapper">
            <label htmlFor={`lang-select-${block.id}`} className="syncdoc-lang-label">
              Language:
            </label>
            <select
              id={`lang-select-${block.id}`}
              className="syncdoc-lang-select"
              value={block.language || 'javascript'}
              onChange={handleLanguageChange}
              aria-label="Select Programming Language"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Center/Right Actions: Copy, Run, Block Controls */}
        <div className="syncdoc-code-header-right">
          <button
            type="button"
            className={`syncdoc-btn-action syncdoc-btn-copy ${copied ? 'is-copied' : ''}`}
            onClick={handleCopy}
            title="Copy code to clipboard"
            aria-label="Copy Code"
          >
            {copied ? (
              <>
                <CheckIcon size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <CopyIcon size={14} />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            className={`syncdoc-btn-action syncdoc-btn-run ${isRunning ? 'is-running' : ''}`}
            onClick={handleRun}
            disabled={isRunning}
            title="Run Code"
            aria-label="Run Code"
          >
            {isRunning ? (
              <>
                <span className="syncdoc-spinner" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <PlayIcon size={13} />
                <span>Run</span>
              </>
            )}
          </button>

          <span className="syncdoc-header-separator" />

          {/* Block Management Toolbar */}
          <BlockToolbar
            onMoveUp={() => onMoveUp(block.id)}
            onMoveDown={() => onMoveDown(block.id)}
            onDuplicate={() => onDuplicate(block.id)}
            onDelete={() => onDelete(block.id)}
            isFirst={isFirst}
            isLast={isLast}
            blockType="Code"
          />
        </div>
      </div>

      {/* Code Editor Container: Line Numbers + Textarea */}
      <div className="syncdoc-code-editor-wrapper">
        {/* Line Numbers Gutter */}
        <div
          ref={lineNumbersRef}
          className="syncdoc-line-numbers"
          aria-hidden="true"
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i + 1} className="syncdoc-line-number">
              {i + 1}
            </div>
          ))}
        </div>

        {/* Code Input Area */}
        <textarea
          ref={textareaRef}
          className="syncdoc-code-textarea"
          value={block.content || ''}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          placeholder={`// Write your ${block.language || 'code'} here...`}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          rows={Math.max(lineCount, 4)}
        />
      </div>

      {/* Output Section (Placeholder / Simulated Output) */}
      {output !== null && (
        <div className="syncdoc-code-output-container">
          <div className="syncdoc-output-header">
            <div className="syncdoc-output-title">
              <TerminalIcon size={14} />
              <span>Output</span>
              {executionTime && (
                <span className="syncdoc-output-badge">
                  Finished in {executionTime}s
                </span>
              )}
            </div>

            <button
              type="button"
              className="syncdoc-output-clear-btn"
              onClick={handleClearOutput}
              title="Clear output"
              aria-label="Clear output"
            >
              <CloseIcon size={13} />
              <span>Clear</span>
            </button>
          </div>

          <div className="syncdoc-output-body">
            <pre className="syncdoc-output-text">{output}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

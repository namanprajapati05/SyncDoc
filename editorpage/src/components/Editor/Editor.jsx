import React, { useState } from 'react';
import TextBlock from './TextBlock';
import CodeBlock from './CodeBlock';
import AddBlock from './AddBlock';
import {
  DocumentIcon,
  TextIcon,
  CodeIcon,
  CheckIcon,
  ResetIcon,
  DownloadIcon,
  SparklesIcon
} from '../common/Icons';
import './Editor.css';

// Initial starter blocks for immediate demonstration
const INITIAL_BLOCKS = [
  {
    id: 'block-1',
    type: 'text',
    content: '<h2>🚀 Welcome to SyncDoc</h2><p>SyncDoc is a modern collaborative notebook combining rich text documentation with interactive code cells. Inspired by <b>Google Colab</b> and <b>Notion</b>, each block is independent and can be moved, duplicated, or styled effortlessly.</p><ul><li><b>Rich Text:</b> Headings, bold, italic, underline, and structured lists</li><li><b>Multi-language Code:</b> Line numbers, copy-to-clipboard, and simulated execution</li><li><b>Colab-Style Workflow:</b> Reorder cells, duplicate, and insert anywhere</li></ul>'
  },
  {
    id: 'block-2',
    type: 'code',
    language: 'python',
    content: `# Python 3 Demonstration
def calculate_metrics(team_name, completed_tasks):
    accuracy = 98.5
    print(f"Team: {team_name}")
    print(f"Tasks Completed: {completed_tasks}")
    print(f"Sync Accuracy: {accuracy}%")
    return "All systems operational!"

# Execute this block using the Run button above
calculate_metrics("SyncDoc Core", 42)`,
    output: `Team: SyncDoc Core\nTasks Completed: 42\nSync Accuracy: 98.5%\nAll systems operational!`,
    executionTime: '0.12'
  },
  {
    id: 'block-3',
    type: 'text',
    content: '<h3>⚡ JavaScript Utility Function</h3><p>Below is a clean JavaScript example demonstrating data formatting. Try clicking <b>Copy</b> to copy the snippet, or modify the code and press <b>Run</b> to test output handling.</p>'
  },
  {
    id: 'block-4',
    type: 'code',
    language: 'javascript',
    content: `// JavaScript helper to format document metadata
function formatDocumentSummary(title, blockCount) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(\`[SyncDoc @ \${timestamp}] "\${title}" has \${blockCount} active blocks.\`);
  return { status: "ready", blocks: blockCount };
}

formatDocumentSummary("SyncDoc Architecture", 4);`,
    output: `[SyncDoc @ 10:45:00 AM] "SyncDoc Architecture" has 4 active blocks.`,
    executionTime: '0.08'
  }
];

export default function Editor() {
  const [documentTitle, setDocumentTitle] = useState('SyncDoc Engineering Workspace');
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [saveStatus, setSaveStatus] = useState('Saved locally');

  // Generate unique block ID
  const generateId = () => `block-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

  // Flash save status indicator
  const triggerSaveNotification = () => {
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Saved locally');
    }, 400);
  };

  // Add block at specific index (or at end if index is null)
  const handleAddBlock = (type, targetIndex = null) => {
    const newBlock = {
      id: generateId(),
      type: type,
      content: type === 'code' ? '' : '',
      ...(type === 'code' ? { language: 'javascript', output: null, executionTime: null } : {})
    };

    setBlocks((prevBlocks) => {
      let updated;
      if (targetIndex === null || targetIndex >= prevBlocks.length) {
        updated = [...prevBlocks, newBlock];
      } else {
        updated = [
          ...prevBlocks.slice(0, targetIndex),
          newBlock,
          ...prevBlocks.slice(targetIndex)
        ];
      }
      return updated;
    });

    setSelectedBlockId(newBlock.id);
    triggerSaveNotification();
  };

  // Update specific block content or properties
  const handleUpdateBlock = (id, updates) => {
    setBlocks((prevBlocks) =>
      prevBlocks.map((block) =>
        block.id === id ? { ...block, ...updates } : block
      )
    );
    triggerSaveNotification();
  };

  // Delete block
  const handleDeleteBlock = (id) => {
    setBlocks((prevBlocks) => prevBlocks.filter((b) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
    triggerSaveNotification();
  };

  // Duplicate block directly below it
  const handleDuplicateBlock = (id) => {
    setBlocks((prevBlocks) => {
      const index = prevBlocks.findIndex((b) => b.id === id);
      if (index === -1) return prevBlocks;

      const sourceBlock = prevBlocks[index];
      const duplicatedBlock = {
        ...sourceBlock,
        id: generateId(),
        // duplicate output reset or copy
        output: sourceBlock.output || null,
        executionTime: sourceBlock.executionTime || null
      };

      const nextBlocks = [...prevBlocks];
      nextBlocks.splice(index + 1, 0, duplicatedBlock);
      return nextBlocks;
    });

    triggerSaveNotification();
  };

  // Move block up
  const handleMoveUp = (id) => {
    setBlocks((prevBlocks) => {
      const index = prevBlocks.findIndex((b) => b.id === id);
      if (index <= 0) return prevBlocks;

      const updated = [...prevBlocks];
      const temp = updated[index];
      updated[index] = updated[index - 1];
      updated[index - 1] = temp;
      return updated;
    });
  };

  // Move block down
  const handleMoveDown = (id) => {
    setBlocks((prevBlocks) => {
      const index = prevBlocks.findIndex((b) => b.id === id);
      if (index === -1 || index >= prevBlocks.length - 1) return prevBlocks;

      const updated = [...prevBlocks];
      const temp = updated[index];
      updated[index] = updated[index + 1];
      updated[index + 1] = temp;
      return updated;
    });
  };

  // Reset to initial sample blocks
  const handleResetDemo = () => {
    if (window.confirm('Reset editor to initial sample demonstration blocks?')) {
      setBlocks(INITIAL_BLOCKS);
      setSelectedBlockId(null);
      triggerSaveNotification();
    }
  };

  // Export Document as JSON for future team / API integration
  const handleExportJSON = () => {
    const exportData = {
      title: documentTitle,
      exportedAt: new Date().toISOString(),
      blockCount: blocks.length,
      blocks: blocks.map((b) => ({
        id: b.id,
        type: b.type,
        content: b.content,
        ...(b.type === 'code' ? { language: b.language } : {})
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${documentTitle.toLowerCase().replace(/\s+/g, '-') || 'document'}.syncdoc.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="syncdoc-editor-page">
      {/* 1. TOP HEADER */}
      <header className="syncdoc-header">
        <div className="syncdoc-header-inner">
          {/* Brand & Document Title */}
          <div className="syncdoc-brand-title-group">
            <div className="syncdoc-brand-logo" title="SyncDoc Notebook Editor">
              <DocumentIcon size={20} className="syncdoc-logo-icon" />
              <span className="syncdoc-brand-text">SyncDoc</span>
            </div>

            <div className="syncdoc-header-divider" />

            <div className="syncdoc-doc-title-wrapper">
              <input
                type="text"
                className="syncdoc-doc-title-input"
                value={documentTitle}
                onChange={(e) => {
                  setDocumentTitle(e.target.value);
                  triggerSaveNotification();
                }}
                placeholder="Untitled Document"
                aria-label="Document Title"
              />
              <div className="syncdoc-status-badge">
                <CheckIcon size={12} className="syncdoc-status-check" />
                <span>{saveStatus}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Add Text, Add Code, Controls */}
          <div className="syncdoc-header-actions">
            <button
              type="button"
              className="syncdoc-btn-header syncdoc-btn-add-text"
              onClick={() => handleAddBlock('text')}
              title="Add a new text block at the end"
            >
              <TextIcon size={16} />
              <span>+ Text</span>
            </button>

            <button
              type="button"
              className="syncdoc-btn-header syncdoc-btn-add-code"
              onClick={() => handleAddBlock('code')}
              title="Add a new code block at the end"
            >
              <CodeIcon size={16} />
              <span>+ Code</span>
            </button>

            <div className="syncdoc-header-divider" />

            <button
              type="button"
              className="syncdoc-btn-header-secondary"
              onClick={handleExportJSON}
              title="Export Document JSON (Ready for backend integration)"
              aria-label="Export Document"
            >
              <DownloadIcon size={15} />
              <span className="syncdoc-hide-mobile">Export</span>
            </button>

            <button
              type="button"
              className="syncdoc-btn-header-secondary"
              onClick={handleResetDemo}
              title="Reset to sample demonstration"
              aria-label="Reset Demo"
            >
              <ResetIcon size={15} />
              <span className="syncdoc-hide-mobile">Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. SUB-HEADER / WORKSPACE INFO BAR */}
      <div className="syncdoc-info-bar">
        <div className="syncdoc-info-bar-inner">
          <div className="syncdoc-meta-tags">
            <span className="syncdoc-meta-pill">
              {blocks.length} {blocks.length === 1 ? 'Block' : 'Blocks'}
            </span>
            <span className="syncdoc-meta-pill">
              {blocks.filter((b) => b.type === 'text').length} Text
            </span>
            <span className="syncdoc-meta-pill">
              {blocks.filter((b) => b.type === 'code').length} Code
            </span>
          </div>

          <div className="syncdoc-shortcuts-hint syncdoc-hide-mobile">
            <span>Tip: Hover between blocks or use top bar to insert cells</span>
          </div>
        </div>
      </div>

      {/* 3. EDITOR WORKSPACE */}
      <main className="syncdoc-workspace">
        <div className="syncdoc-workspace-inner">
          {/* Top insertion line */}
          <AddBlock
            onAddText={() => handleAddBlock('text', 0)}
            onAddCode={() => handleAddBlock('code', 0)}
            label="Add Block at Top"
          />

          {/* Render All Independent Blocks */}
          {blocks.length === 0 ? (
            <div className="syncdoc-empty-state">
              <div className="syncdoc-empty-icon-wrap">
                <DocumentIcon size={36} />
              </div>
              <h3 className="syncdoc-empty-title">Your Document is Empty</h3>
              <p className="syncdoc-empty-desc">
                Get started by creating your first block. You can combine rich formatted text and runnable code blocks.
              </p>
              <div className="syncdoc-empty-actions">
                <button
                  type="button"
                  className="syncdoc-btn-header syncdoc-btn-add-text"
                  onClick={() => handleAddBlock('text')}
                >
                  <TextIcon size={16} />
                  <span>Add Text Block</span>
                </button>
                <button
                  type="button"
                  className="syncdoc-btn-header syncdoc-btn-add-code"
                  onClick={() => handleAddBlock('code')}
                >
                  <CodeIcon size={16} />
                  <span>Add Code Block</span>
                </button>
              </div>
            </div>
          ) : (
            blocks.map((block, index) => (
              <React.Fragment key={block.id}>
                {block.type === 'text' ? (
                  <TextBlock
                    block={block}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                    onDuplicate={handleDuplicateBlock}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    isFirst={index === 0}
                    isLast={index === blocks.length - 1}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                  />
                ) : (
                  <CodeBlock
                    block={block}
                    onUpdate={handleUpdateBlock}
                    onDelete={handleDeleteBlock}
                    onDuplicate={handleDuplicateBlock}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    isFirst={index === 0}
                    isLast={index === blocks.length - 1}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                  />
                )}

                {/* Insertion divider between blocks */}
                <AddBlock
                  onAddText={() => handleAddBlock('text', index + 1)}
                  onAddCode={() => handleAddBlock('code', index + 1)}
                  label="Add Block"
                />
              </React.Fragment>
            ))
          )}
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="syncdoc-footer">
        <div className="syncdoc-footer-inner">
          <span>SyncDoc Editor Frontend &bull; Google Colab & Notion Architecture</span>
          <span className="syncdoc-status-text">Client-only Reactive State</span>
        </div>
      </footer>
    </div>
  );
}

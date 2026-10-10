import React, { useState, useRef, useEffect } from 'react';
import BlockToolbar from './BlockToolbar';
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  HeadingIcon,
  ListBulletIcon,
  ListOrderedIcon,
  TextIcon
} from '../common/Icons';
import './TextBlock.css';

/**
 * TextBlock component represents a rich text block cell.
 * Features inline formatting (Bold, Italic, Underline, Heading, Lists)
 * and block rearrangement controls.
 */
export default function TextBlock({
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
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef(null);

  // Sync content with ref without breaking cursor position
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== block.content) {
      // Only update if difference exists and not actively typing inside
      if (!isFocused || editorRef.current.innerHTML.trim() === '') {
        editorRef.current.innerHTML = block.content || '';
      }
    }
  }, [block.content, isFocused]);

  const handleInput = () => {
    if (editorRef.current) {
      const newHtml = editorRef.current.innerHTML;
      onUpdate(block.id, { content: newHtml });
    }
  };

  // Execute formatting command safely
  const executeCommand = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    handleInput();
  };

  const handleHeading = (tag) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand('formatBlock', false, tag);
    handleInput();
  };

  const getWordAndCharCount = () => {
    if (!editorRef.current) return { words: 0, chars: 0 };
    const text = editorRef.current.innerText || '';
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).length : 0;
    const chars = cleanText.length;
    return { words, chars };
  };

  const stats = getWordAndCharCount();
  const showControls = isFocused || isSelected;

  return (
    <div
      className={`syncdoc-block syncdoc-text-block ${showControls ? 'is-active' : ''}`}
      onClick={onSelect}
      onFocus={() => {
        setIsFocused(true);
        onSelect();
      }}
      onBlur={() => {
        // Small delay to allow clicking toolbar buttons without losing active state
        setTimeout(() => {
          if (!editorRef.current?.contains(document.activeElement)) {
            setIsFocused(false);
          }
        }, 150);
      }}
    >
      {/* Block Top Header */}
      <div className="syncdoc-block-header">
        <div className="syncdoc-block-tag text-tag">
          <TextIcon size={14} />
          <span>Text Block</span>
        </div>

        {/* Text Formatting Toolbar (Shown when active or focused) */}
        <div className={`syncdoc-formatting-toolbar ${showControls ? 'is-visible' : ''}`}>
          <button
            type="button"
            className="syncdoc-format-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('bold');
            }}
            title="Bold (Ctrl+B)"
            aria-label="Bold"
          >
            <BoldIcon size={14} />
          </button>

          <button
            type="button"
            className="syncdoc-format-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('italic');
            }}
            title="Italic (Ctrl+I)"
            aria-label="Italic"
          >
            <ItalicIcon size={14} />
          </button>

          <button
            type="button"
            className="syncdoc-format-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('underline');
            }}
            title="Underline (Ctrl+U)"
            aria-label="Underline"
          >
            <UnderlineIcon size={14} />
          </button>

          <span className="syncdoc-toolbar-divider" />

          <button
            type="button"
            className="syncdoc-format-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              handleHeading('<h2>');
            }}
            title="Heading 1"
            aria-label="Heading 1"
          >
            <HeadingIcon size={14} />
            <span className="syncdoc-btn-subscript">1</span>
          </button>

          <button
            type="button"
            className="syncdoc-format-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              handleHeading('<h3>');
            }}
            title="Heading 2"
            aria-label="Heading 2"
          >
            <HeadingIcon size={14} />
            <span className="syncdoc-btn-subscript">2</span>
          </button>

          <button
            type="button"
            className="syncdoc-format-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              handleHeading('<p>');
            }}
            title="Normal Paragraph"
            aria-label="Paragraph"
          >
            <span style={{ fontSize: '12px', fontWeight: 600 }}>P</span>
          </button>

          <span className="syncdoc-toolbar-divider" />

          <button
            type="button"
            className="syncdoc-format-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertUnorderedList');
            }}
            title="Bullet List"
            aria-label="Bullet List"
          >
            <ListBulletIcon size={14} />
          </button>

          <button
            type="button"
            className="syncdoc-format-btn"
            onMouseDown={(e) => {
              e.preventDefault();
              executeCommand('insertOrderedList');
            }}
            title="Numbered List"
            aria-label="Numbered List"
          >
            <ListOrderedIcon size={14} />
          </button>
        </div>

        {/* Block Management Actions */}
        <div className="syncdoc-block-actions">
          <BlockToolbar
            onMoveUp={() => onMoveUp(block.id)}
            onMoveDown={() => onMoveDown(block.id)}
            onDuplicate={() => onDuplicate(block.id)}
            onDelete={() => onDelete(block.id)}
            isFirst={isFirst}
            isLast={isLast}
            blockType="Text"
          />
        </div>
      </div>

      {/* Editable Text Area */}
      <div className="syncdoc-text-editor-container">
        <div
          ref={editorRef}
          className="syncdoc-text-editable"
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          data-placeholder="Start writing..."
          role="textbox"
          aria-multiline="true"
        />
      </div>

      {/* Footer info */}
      <div className="syncdoc-block-footer">
        <span className="syncdoc-word-count">
          {stats.words} {stats.words === 1 ? 'word' : 'words'} &bull; {stats.chars} characters
        </span>
      </div>
    </div>
  );
}

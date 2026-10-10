import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, TextIcon, CodeIcon, CloseIcon } from '../common/Icons';
import './AddBlock.css';

/**
 * AddBlock component renders an interactive insertion point between blocks.
 * Clicking "+" reveals options to insert either a Text or Code block.
 */
export default function AddBlock({ onAddText, onAddCode, label = "Add Block" }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectText = () => {
    onAddText();
    setIsOpen(false);
  };

  const handleSelectCode = () => {
    onAddCode();
    setIsOpen(false);
  };

  return (
    <div className={`syncdoc-add-block-wrapper ${isOpen ? 'is-open' : ''}`} ref={containerRef}>
      <div className="syncdoc-add-line" />

      {!isOpen ? (
        <button
          type="button"
          className="syncdoc-add-trigger-btn"
          onClick={() => setIsOpen(true)}
          title="Insert block here"
          aria-expanded={isOpen}
        >
          <PlusIcon size={14} className="syncdoc-add-icon" />
          <span className="syncdoc-add-label">{label}</span>
        </button>
      ) : (
        <div className="syncdoc-add-menu-container">
          <div className="syncdoc-add-menu-header">
            <span className="syncdoc-add-menu-title">+ Insert Block</span>
            <button
              type="button"
              className="syncdoc-add-menu-close"
              onClick={() => setIsOpen(false)}
              title="Cancel"
              aria-label="Close add block menu"
            >
              <CloseIcon size={14} />
            </button>
          </div>

          <div className="syncdoc-add-menu-options">
            <button
              type="button"
              className="syncdoc-add-option-btn syncdoc-add-option-text"
              onClick={handleSelectText}
            >
              <div className="syncdoc-option-icon-box text-icon-box">
                <TextIcon size={18} />
              </div>
              <div className="syncdoc-option-details">
                <span className="syncdoc-option-title">Text Block</span>
                <span className="syncdoc-option-desc">Rich notes, headings, and lists</span>
              </div>
            </button>

            <button
              type="button"
              className="syncdoc-add-option-btn syncdoc-add-option-code"
              onClick={handleSelectCode}
            >
              <div className="syncdoc-option-icon-box code-icon-box">
                <CodeIcon size={18} />
              </div>
              <div className="syncdoc-option-details">
                <span className="syncdoc-option-title">Code Block</span>
                <span className="syncdoc-option-desc">Multi-language code cell with runner</span>
              </div>
            </button>
          </div>
        </div>
      )}

      <div className="syncdoc-add-line" />
    </div>
  );
}

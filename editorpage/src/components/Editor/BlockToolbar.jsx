import React from 'react';
import { ArrowUpIcon, ArrowDownIcon, DuplicateIcon, TrashIcon } from '../common/Icons';
import './BlockToolbar.css';

/**
 * BlockToolbar provides standard block manipulation actions:
 * Move Up, Move Down, Duplicate, Delete
 */
export default function BlockToolbar({
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  isFirst = false,
  isLast = false,
  blockType = 'block'
}) {
  return (
    <div className="syncdoc-block-toolbar" role="toolbar" aria-label={`${blockType} block controls`}>
      <button
        type="button"
        className="syncdoc-toolbar-btn"
        onClick={onMoveUp}
        disabled={isFirst}
        title={isFirst ? "Already at top" : "Move block up"}
        aria-label="Move block up"
      >
        <ArrowUpIcon size={15} />
      </button>

      <button
        type="button"
        className="syncdoc-toolbar-btn"
        onClick={onMoveDown}
        disabled={isLast}
        title={isLast ? "Already at bottom" : "Move block down"}
        aria-label="Move block down"
      >
        <ArrowDownIcon size={15} />
      </button>

      <span className="syncdoc-toolbar-divider" />

      <button
        type="button"
        className="syncdoc-toolbar-btn"
        onClick={onDuplicate}
        title="Duplicate block"
        aria-label="Duplicate block"
      >
        <DuplicateIcon size={15} />
      </button>

      <button
        type="button"
        className="syncdoc-toolbar-btn syncdoc-toolbar-btn-danger"
        onClick={onDelete}
        title="Delete block"
        aria-label="Delete block"
      >
        <TrashIcon size={15} />
      </button>
    </div>
  );
}

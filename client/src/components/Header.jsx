import React from 'react';
import { FolderArchive, Plus } from 'lucide-react';

/**
 * Top navigation header displaying the FileHub branding and primary call-to-action
 */
export default function Header({ onOpenAddModal }) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-icon">
            <FolderArchive size={22} />
          </div>
          <div className="brand-text">
            <h1>FileHub</h1>
            <p>Smart File & Document Organizer</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenAddModal}
          >
            <Plus size={16} />
            <span>Add Document</span>
          </button>
        </div>
      </div>
    </header>
  );
}

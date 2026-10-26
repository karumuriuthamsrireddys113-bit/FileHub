import React from 'react';
import { FolderArchive, Plus, LogOut } from 'lucide-react';

/**
 * Top navigation header displaying FileHub branding, Add Document CTA,
 * authenticated user profile badge, and Logout button.
 */
export default function Header({ onOpenAddModal, currentUser, onLogout }) {
  const initial = currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';

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

          {currentUser && (
            <div className="user-nav-group">
              <div className="user-pill" title={`Logged in as ${currentUser.email}`}>
                <span className="user-avatar">{initial}</span>
                <span className="user-display-name">{currentUser.name}</span>
              </div>
              <button
                type="button"
                className="btn btn-secondary btn-logout"
                onClick={onLogout}
                title="Log out of FileHub"
              >
                <LogOut size={16} />
                <span className="logout-label">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

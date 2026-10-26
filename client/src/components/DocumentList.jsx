import React from 'react';
import { FolderOpen, AlertCircle, RefreshCw, Plus } from 'lucide-react';
import DocumentCard from './DocumentCard.jsx';
import DocumentRow from './DocumentRow.jsx';

/**
 * DocumentList handles loading, error, empty, and document display (Grid or Table)
 */
export default function DocumentList({
  documents,
  isLoading,
  isError,
  error,
  onRetry,
  viewMode,
  onView,
  onEdit,
  onDelete,
  onOpenAddModal,
  isFiltered
}) {
  // 1. Loading State
  if (isLoading) {
    return (
      <div className="state-box" aria-live="polite">
        <div className="spinner" />
        <h3>Loading documents...</h3>
        <p>Fetching your organized files from the database.</p>
      </div>
    );
  }

  // 2. Error State
  if (isError) {
    return (
      <div className="state-box" role="alert">
        <div className="state-icon" style={{ color: '#ef4444', backgroundColor: '#fee2e2' }}>
          <AlertCircle size={28} />
        </div>
        <h3>Failed to load documents</h3>
        <p>{error?.extractedMessage || error?.message || 'A network error occurred while connecting to the server.'}</p>
        <button type="button" className="btn btn-secondary" onClick={onRetry}>
          <RefreshCw size={14} />
          <span>Try Again</span>
        </button>
      </div>
    );
  }

  // 3. Empty State
  if (!documents || documents.length === 0) {
    return (
      <div className="state-box">
        <div className="state-icon">
          <FolderOpen size={28} />
        </div>
        <h3>{isFiltered ? 'No documents match your filters' : 'No documents added yet'}</h3>
        <p>
          {isFiltered
            ? 'Try adjusting your search query or category filter to find what you are looking for.'
            : 'Start building your library by organizing your college papers, work reports, or personal records.'}
        </p>
        {isFiltered ? null : (
          <button type="button" className="btn btn-primary" onClick={onOpenAddModal}>
            <Plus size={16} />
            <span>Add Your First Document</span>
          </button>
        )}
      </div>
    );
  }

  // 4. Table View
  if (viewMode === 'table') {
    return (
      <div className="table-container">
        <table className="documents-table">
          <thead>
            <tr>
              <th>Document</th>
              <th>Category</th>
              <th>File Link</th>
              <th>Added Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <DocumentRow
                key={doc.id}
                document={doc}
                onView={onView}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 5. Grid Card View (Default)
  return (
    <div className="documents-grid">
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

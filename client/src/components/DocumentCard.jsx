import React from 'react';
import { FileText, ExternalLink, Calendar, Edit3, Trash2, Eye } from 'lucide-react';
import CategoryBadge from './CategoryBadge.jsx';

/**
 * Format ISO date string into readable local date format
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
}

/**
 * DocumentCard displays a single document as an interactive dashboard card.
 *
 * Performance Note:
 * React.memo prevents unnecessary re-renders of DocumentCard when parent components
 * re-render (e.g. during typing in search or updating other documents in the list),
 * as long as its props (document, stable event callbacks) remain identical.
 */
const DocumentCard = React.memo(function DocumentCard({
  document,
  onView,
  onEdit,
  onDelete
}) {
  const { id, name, description, category, fileUrl, createdAt } = document;

  return (
    <article className="doc-card" aria-label={name}>
      <div className="doc-card-header">
        <div className="doc-card-title-group">
          <div className="doc-type-icon">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="doc-card-name" title={name}>
              {name}
            </h3>
          </div>
        </div>
        <CategoryBadge category={category} />
      </div>

      <p className="doc-card-description">
        {description || 'No description provided.'}
      </p>

      <div className="doc-card-meta">
        <div className="doc-meta-item">
          <Calendar size={13} />
          <span>Added: {formatDate(createdAt)}</span>
        </div>

        {fileUrl ? (
          <div className="doc-meta-item">
            <a
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="doc-url-link"
              title={`Open document: ${fileUrl}`}
            >
              <ExternalLink size={13} />
              <span>Open External Document</span>
            </a>
          </div>
        ) : (
          <div className="doc-meta-item" style={{ color: '#94a3b8' }}>
            <span>No external file linked</span>
          </div>
        )}
      </div>

      <div className="doc-card-actions">
        <button
          type="button"
          className="action-btn"
          onClick={() => onView(document)}
          title="View full details"
          aria-label={`View details for ${name}`}
        >
          <Eye size={14} />
          <span>Details</span>
        </button>

        <button
          type="button"
          className="action-btn"
          onClick={() => onEdit(document)}
          title="Edit document"
          aria-label={`Edit ${name}`}
        >
          <Edit3 size={14} />
          <span>Edit</span>
        </button>

        <button
          type="button"
          className="action-btn action-btn-danger"
          onClick={() => onDelete(document)}
          title="Delete document"
          aria-label={`Delete ${name}`}
        >
          <Trash2 size={14} />
          <span>Delete</span>
        </button>
      </div>
    </article>
  );
});

export default DocumentCard;

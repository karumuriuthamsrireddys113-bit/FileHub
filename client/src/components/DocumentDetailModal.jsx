import React from 'react';
import { X, ExternalLink, Calendar, Clock, Edit3, Trash2, Hash } from 'lucide-react';
import CategoryBadge from './CategoryBadge.jsx';

/**
 * Format ISO date string into detailed local date and time string
 */
function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  } catch {
    return dateString;
  }
}

/**
 * Modal to display complete document details and quick action buttons
 */
export default function DocumentDetailModal({
  isOpen,
  document,
  onClose,
  onEdit,
  onDelete
}) {
  if (!isOpen || !document) return null;

  const { id, name, description, category, fileUrl, createdAt, updatedAt } = document;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Document Details</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-item">
            <span className="detail-label">Name</span>
            <div className="detail-value" style={{ fontWeight: 600, fontSize: '1.05rem' }}>
              {name}
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-label">Category</span>
            <div>
              <CategoryBadge category={category} />
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-label">Description</span>
            <div className="detail-value" style={{ color: description ? 'inherit' : '#94a3b8' }}>
              {description || 'No description provided.'}
            </div>
          </div>

          <div className="detail-item">
            <span className="detail-label">External File Link</span>
            {fileUrl ? (
              <div>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="doc-url-link"
                  style={{ wordBreak: 'break-all' }}
                >
                  <ExternalLink size={14} />
                  <span>{fileUrl}</span>
                </a>
              </div>
            ) : (
              <div className="detail-value" style={{ color: '#94a3b8' }}>
                No external URL attached
              </div>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.25rem' }}>
            <div className="detail-item">
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={12} />
                <span>Created At</span>
              </span>
              <div className="detail-value" style={{ fontSize: '0.85rem' }}>
                {formatDateTime(createdAt)}
              </div>
            </div>

            <div className="detail-item">
              <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={12} />
                <span>Last Updated</span>
              </span>
              <div className="detail-value" style={{ fontSize: '0.85rem' }}>
                {formatDateTime(updatedAt)}
              </div>
            </div>
          </div>

          <div className="detail-item" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', marginBottom: 0 }}>
            <span className="detail-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Hash size={12} />
              <span>Document ID</span>
            </span>
            <div className="detail-value" style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#64748b' }}>
              {id}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
          >
            Close
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              onClose();
              onEdit(document);
            }}
          >
            <Edit3 size={14} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => {
              onClose();
              onDelete(document);
            }}
          >
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}

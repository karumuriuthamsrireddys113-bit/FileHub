import React from 'react';
import { AlertTriangle, Trash2 } from 'lucide-react';

/**
 * Delete confirmation dialog before removing a document permanently
 */
export default function DeleteConfirmModal({
  isOpen,
  document,
  onClose,
  onConfirm,
  isPending
}) {
  if (!isOpen || !document) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#dc2626' }}>
            <AlertTriangle size={20} />
            <h2>Delete Document?</h2>
          </div>
        </div>

        <div className="modal-body">
          <p style={{ fontSize: '0.925rem', color: '#334155', marginBottom: '0.75rem' }}>
            Are you sure you want to permanently delete:
          </p>
          <div
            style={{
              padding: '0.75rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              fontWeight: 600,
              fontSize: '0.9rem',
              color: '#0f172a',
              wordBreak: 'break-word'
            }}
          >
            {document.name}
          </div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.75rem' }}>
            This action cannot be undone. All metadata for this file will be removed from your database.
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => onConfirm(document.id)}
            disabled={isPending}
          >
            <Trash2 size={14} />
            <span>{isPending ? 'Deleting...' : 'Yes, Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

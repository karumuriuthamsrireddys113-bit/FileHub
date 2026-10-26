import React from 'react';
import { FileText, ExternalLink, Edit3, Trash2, Eye } from 'lucide-react';
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
 * DocumentRow displays a single document row in the table view.
 *
 * Performance Note:
 * React.memo skips re-rendering this row if its document data and callbacks haven't
 * changed, optimizing table performance when sorting or modifying individual records.
 */
const DocumentRow = React.memo(function DocumentRow({
  document,
  onView,
  onEdit,
  onDelete
}) {
  const { id, name, description, category, fileUrl, createdAt } = document;

  return (
    <tr>
      <td>
        <div className="table-doc-name">
          <FileText size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
          <span title={name}>{name}</span>
        </div>
        {description && (
          <div className="table-doc-desc" title={description}>
            {description}
          </div>
        )}
      </td>
      <td>
        <CategoryBadge category={category} />
      </td>
      <td>
        {fileUrl ? (
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="doc-url-link"
            title={fileUrl}
          >
            <ExternalLink size={13} />
            <span>Open Link</span>
          </a>
        ) : (
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>None</span>
        )}
      </td>
      <td style={{ color: '#64748b', fontSize: '0.825rem', whiteSpace: 'nowrap' }}>
        {formatDate(createdAt)}
      </td>
      <td>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            className="action-btn"
            onClick={() => onView(document)}
            title="View details"
          >
            <Eye size={13} />
          </button>
          <button
            type="button"
            className="action-btn"
            onClick={() => onEdit(document)}
            title="Edit document"
          >
            <Edit3 size={13} />
          </button>
          <button
            type="button"
            className="action-btn action-btn-danger"
            onClick={() => onDelete(document)}
            title="Delete document"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </tr>
  );
});

export default DocumentRow;

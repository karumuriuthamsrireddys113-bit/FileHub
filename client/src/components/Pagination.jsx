import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination component for navigating document pages
 */
export default function Pagination({
  pagination,
  onPageChange,
  onLimitChange
}) {
  if (!pagination || pagination.totalDocuments === 0) {
    return null;
  }

  const { page, limit, totalDocuments, totalPages, hasNextPage, hasPrevPage } = pagination;
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalDocuments);

  return (
    <nav className="pagination-container" aria-label="Pagination Navigation">
      <div className="pagination-info">
        Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of{' '}
        <strong>{totalDocuments}</strong> documents
      </div>

      <div className="pagination-controls">
        <label htmlFor="per-page-select" style={{ fontSize: '0.8rem', color: '#64748b' }}>
          Per page:
        </label>
        <select
          id="per-page-select"
          className="filter-select"
          style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
        >
          <option value={6}>6</option>
          <option value={8}>8</option>
          <option value={12}>12</option>
          <option value={24}>24</option>
        </select>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrevPage}
          title="Previous page"
          aria-label="Previous page"
        >
          <ChevronLeft size={15} />
          <span>Previous</span>
        </button>

        <span style={{ fontSize: '0.85rem', fontWeight: 500, padding: '0 0.4rem' }}>
          Page {page} of {totalPages}
        </span>

        <button
          type="button"
          className="btn btn-secondary"
          style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNextPage}
          title="Next page"
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={15} />
        </button>
      </div>
    </nav>
  );
}

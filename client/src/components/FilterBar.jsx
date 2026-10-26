import React from 'react';
import { Search, X, LayoutGrid, List, RotateCcw } from 'lucide-react';

const CATEGORIES = ['All', 'College', 'Personal', 'Work', 'Finance', 'Other'];

const SORT_OPTIONS = [
  { label: 'Newest Added', sortBy: 'createdAt', order: 'desc' },
  { label: 'Oldest Added', sortBy: 'createdAt', order: 'asc' },
  { label: 'Recently Updated', sortBy: 'updatedAt', order: 'desc' },
  { label: 'Name (A to Z)', sortBy: 'name', order: 'asc' },
  { label: 'Name (Z to A)', sortBy: 'name', order: 'desc' }
];

/**
 * FilterBar provides search, category filtering, sorting, and view toggle controls
 */
export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sortConfig,
  onSortChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  isFiltered
}) {
  const currentSortKey = `${sortConfig.sortBy}-${sortConfig.order}`;

  const handleSortSelect = (e) => {
    const [sortBy, order] = e.target.value.split('-');
    onSortChange({ sortBy, order });
  };

  return (
    <div className="filter-bar">
      <div className="filter-row">
        {/* Search Input */}
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search documents by name..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button
              type="button"
              className="clear-search-btn"
              onClick={() => onSearchChange('')}
              title="Clear search"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Category Dropdown */}
        <div className="filter-select-group">
          <select
            className="filter-select"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <select
            className="filter-select"
            value={currentSortKey}
            onChange={handleSortSelect}
            aria-label="Sort documents"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={`${opt.sortBy}-${opt.order}`} value={`${opt.sortBy}-${opt.order}`}>
                Sort: {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Mode Toggle & Reset */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          {isFiltered && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onResetFilters}
              title="Reset all active filters"
            >
              <RotateCcw size={14} />
              <span>Reset</span>
            </button>
          )}

          <div className="view-toggle" role="group" aria-label="View toggle">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => onViewModeChange('grid')}
              title="Grid Card View"
              aria-label="Grid Card View"
            >
              <LayoutGrid size={16} />
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => onViewModeChange('table')}
              title="Table View"
              aria-label="Table View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

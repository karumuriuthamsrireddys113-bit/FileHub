import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Save } from 'lucide-react';

const CATEGORIES = ['College', 'Personal', 'Work', 'Finance', 'Other'];

/**
 * Validates whether a string is a valid HTTP/HTTPS URL
 */
function isValidUrl(string) {
  if (!string || !string.trim()) return true; // Optional field
  try {
    const url = new URL(string.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Modal for creating and editing document records
 */
export default function DocumentFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isPending = false
}) {
  const isEdit = Boolean(initialData);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Work',
    description: '',
    fileUrl: ''
  });

  const [errors, setErrors] = useState({});

  // Reset form when opened or initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || 'Work',
        description: initialData.description || '',
        fileUrl: initialData.fileUrl || ''
      });
    } else {
      setFormData({
        name: '',
        category: 'Work',
        description: '',
        fileUrl: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for the field being edited
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Document name is required';
    } else if (formData.name.trim().length > 150) {
      newErrors.name = 'Document name must not exceed 150 characters';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.fileUrl && !isValidUrl(formData.fileUrl)) {
      newErrors.fileUrl = 'Please provide a valid web URL (e.g., https://example.com/file.pdf)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      name: formData.name.trim(),
      category: formData.category,
      description: formData.description.trim() || null,
      fileUrl: formData.fileUrl.trim() || null
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Document' : 'Add New Document'}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
            disabled={isPending}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Document Name */}
            <div className="form-group">
              <label htmlFor="doc-name" className="form-label">
                Document Name <span className="required">*</span>
              </label>
              <input
                id="doc-name"
                name="name"
                type="text"
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="e.g., Physics Lab Report 2.pdf"
                value={formData.name}
                onChange={handleChange}
                disabled={isPending}
                autoFocus
              />
              {errors.name && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.name}</span>
                </div>
              )}
            </div>

            {/* Category */}
            <div className="form-group">
              <label htmlFor="doc-category" className="form-label">
                Category <span className="required">*</span>
              </label>
              <select
                id="doc-category"
                name="category"
                className={`form-select ${errors.category ? 'error' : ''}`}
                value={formData.category}
                onChange={handleChange}
                disabled={isPending}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.category}</span>
                </div>
              )}
            </div>

            {/* External File URL */}
            <div className="form-group">
              <label htmlFor="doc-url" className="form-label">
                External File URL <span style={{ fontWeight: 400, color: '#64748b' }}>(Optional)</span>
              </label>
              <input
                id="doc-url"
                name="fileUrl"
                type="url"
                className={`form-input ${errors.fileUrl ? 'error' : ''}`}
                placeholder="https://drive.google.com/... or https://example.com/doc.pdf"
                value={formData.fileUrl}
                onChange={handleChange}
                disabled={isPending}
              />
              {errors.fileUrl ? (
                <div className="form-error">
                  <AlertCircle size={13} />
                  <span>{errors.fileUrl}</span>
                </div>
              ) : (
                <p className="form-help">
                  Link an external Google Drive, Dropbox, cloud file, or web document.
                </p>
              )}
            </div>

            {/* Description */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="doc-description" className="form-label">
                Description <span style={{ fontWeight: 400, color: '#64748b' }}>(Optional)</span>
              </label>
              <textarea
                id="doc-description"
                name="description"
                rows={3}
                className="form-textarea"
                placeholder="Brief summary, tags, notes, or key details..."
                value={formData.description}
                onChange={handleChange}
                disabled={isPending}
              />
            </div>
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
              type="submit"
              className="btn btn-primary"
              disabled={isPending}
            >
              <Save size={15} />
              <span>{isPending ? 'Saving...' : isEdit ? 'Update Document' : 'Save Document'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

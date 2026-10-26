import api from './api.js';

/**
 * Service functions for document management API operations
 */

// Fetch paginated, filtered, and sorted documents
export async function fetchDocuments({
  page = 1,
  limit = 8,
  search = '',
  category = 'All',
  sortBy = 'createdAt',
  order = 'desc'
} = {}) {
  const params = {
    page,
    limit,
    sortBy,
    order
  };

  if (search && search.trim()) {
    params.search = search.trim();
  }

  if (category && category !== 'All') {
    params.category = category;
  }

  const response = await api.get('/documents', { params });
  return response.data;
}

// Fetch a single document by its ID
export async function fetchDocumentById(id) {
  const response = await api.get(`/documents/${id}`);
  return response.data.data;
}

// Fetch dashboard statistics (total count & category distribution)
export async function fetchDocumentStats() {
  const response = await api.get('/documents/stats');
  return response.data.data;
}

// Create a new document
export async function createDocument(docData) {
  const response = await api.post('/documents', docData);
  return response.data;
}

// Update an existing document
export async function updateDocument({ id, ...docData }) {
  const response = await api.put(`/documents/${id}`, docData);
  return response.data;
}

// Delete a document
export async function deleteDocument(id) {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
}

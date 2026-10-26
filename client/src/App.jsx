import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from './components/Header.jsx';
import StatsOverview from './components/StatsOverview.jsx';
import FilterBar from './components/FilterBar.jsx';
import DocumentList from './components/DocumentList.jsx';
import Pagination from './components/Pagination.jsx';
import DocumentFormModal from './components/DocumentFormModal.jsx';
import DocumentDetailModal from './components/DocumentDetailModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import Toast from './components/Toast.jsx';
import {
  fetchDocuments,
  fetchDocumentStats,
  createDocument,
  updateDocument,
  deleteDocument
} from './services/documentService.js';

export default function App() {
  const queryClient = useQueryClient();

  // State for pagination, search, filter, and sorting
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortConfig, setSortConfig] = useState({ sortBy: 'createdAt', order: 'desc' });
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [viewingDocument, setViewingDocument] = useState(null);
  const [deletingDocument, setDeletingDocument] = useState(null);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Debounce search query so user typing doesn't trigger rapid server requests
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search term
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  // Reset page when category or sort changes
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setPage(1);
  };

  const handleSortChange = (newSortConfig) => {
    setSortConfig(newSortConfig);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setCategory('All');
    setSortConfig({ sortBy: 'createdAt', order: 'desc' });
    setPage(1);
  };

  // useMemo: Determines whether user has active search or category filters applied.
  // Using useMemo prevents re-calculating filter boolean and active filter count on irrelevant renders.
  const isFiltered = useMemo(() => {
    return Boolean(debouncedSearch.trim()) || category !== 'All';
  }, [debouncedSearch, category]);

  // 1. TanStack Query: Fetch paginated & filtered documents
  const documentsQuery = useQuery({
    queryKey: ['documents', {
      page,
      limit,
      search: debouncedSearch,
      category,
      sortBy: sortConfig.sortBy,
      order: sortConfig.order
    }],
    queryFn: () =>
      fetchDocuments({
        page,
        limit,
        search: debouncedSearch,
        category,
        sortBy: sortConfig.sortBy,
        order: sortConfig.order
      }),
    keepPreviousData: true,
    staleTime: 5000 // Keep fresh for 5 seconds
  });

  // 2. TanStack Query: Fetch dashboard document statistics
  const statsQuery = useQuery({
    queryKey: ['documents', 'stats'],
    queryFn: fetchDocumentStats,
    staleTime: 10000
  });

  // 3. TanStack Mutation: Create Document
  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: (data) => {
      showToast('Document created successfully!', 'success');
      setIsFormModalOpen(false);
      // Invalidate queries so document list and dashboard stats update
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err) => {
      showToast(err.extractedMessage || 'Failed to create document', 'error');
    }
  });

  // 4. TanStack Mutation: Update Document
  const updateMutation = useMutation({
    mutationFn: updateDocument,
    onSuccess: (data) => {
      showToast('Document updated successfully!', 'success');
      setIsFormModalOpen(false);
      setEditingDocument(null);
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err) => {
      showToast(err.extractedMessage || 'Failed to update document', 'error');
    }
  });

  // 5. TanStack Mutation: Delete Document
  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      showToast('Document deleted successfully!', 'success');
      setDeletingDocument(null);
      // If we deleted the last item on a page > 1, adjust page if needed
      if (documentsQuery.data?.data?.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err) => {
      showToast(err.extractedMessage || 'Failed to delete document', 'error');
    }
  });

  // useCallback: Stable event handlers passed down to DocumentList and DocumentCard.
  // Because DocumentCard and DocumentRow are wrapped in React.memo, passing stable
  // callbacks ensures that list items do not re-render unless their specific document data changes.
  const handleOpenAddModal = useCallback(() => {
    setEditingDocument(null);
    setIsFormModalOpen(true);
  }, []);

  const handleViewDocument = useCallback((doc) => {
    setViewingDocument(doc);
  }, []);

  const handleEditDocument = useCallback((doc) => {
    setEditingDocument(doc);
    setIsFormModalOpen(true);
  }, []);

  const handleDeleteDocument = useCallback((doc) => {
    setDeletingDocument(doc);
  }, []);

  const handleFormSubmit = (formData) => {
    if (editingDocument) {
      updateMutation.mutate({ id: editingDocument.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleConfirmDelete = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="app-container">
      {/* Navigation Header */}
      <Header onOpenAddModal={handleOpenAddModal} />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Category Statistics Cards */}
        <StatsOverview
          stats={statsQuery.data}
          selectedCategory={category}
          onSelectCategory={(cat) => {
            // Clicking active category toggles back to 'All'
            handleCategoryChange(category === cat ? 'All' : cat);
          }}
        />

        {/* Search, Filter, Sort, and View Controls */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={handleCategoryChange}
          sortConfig={sortConfig}
          onSortChange={handleSortChange}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onResetFilters={handleResetFilters}
          isFiltered={isFiltered}
        />

        {/* Document List (Grid or Table) */}
        <DocumentList
          documents={documentsQuery.data?.data}
          isLoading={documentsQuery.isLoading}
          isError={documentsQuery.isError}
          error={documentsQuery.error}
          onRetry={() => documentsQuery.refetch()}
          viewMode={viewMode}
          onView={handleViewDocument}
          onEdit={handleEditDocument}
          onDelete={handleDeleteDocument}
          onOpenAddModal={handleOpenAddModal}
          isFiltered={isFiltered}
        />

        {/* Pagination Controls */}
        <Pagination
          pagination={documentsQuery.data?.pagination}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </main>

      {/* Add / Edit Document Modal */}
      <DocumentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingDocument(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={editingDocument}
        isPending={createMutation.isPending || updateMutation.isPending}
      />

      {/* Document Detail Modal */}
      <DocumentDetailModal
        isOpen={Boolean(viewingDocument)}
        document={viewingDocument}
        onClose={() => setViewingDocument(null)}
        onEdit={handleEditDocument}
        onDelete={handleDeleteDocument}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingDocument)}
        document={deletingDocument}
        onClose={() => setDeletingDocument(null)}
        onConfirm={handleConfirmDelete}
        isPending={deleteMutation.isPending}
      />

      {/* Toast Alert Feedback */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FolderArchive } from 'lucide-react';
import Header from './components/Header.jsx';
import StatsOverview from './components/StatsOverview.jsx';
import FilterBar from './components/FilterBar.jsx';
import DocumentList from './components/DocumentList.jsx';
import Pagination from './components/Pagination.jsx';
import DocumentFormModal from './components/DocumentFormModal.jsx';
import DocumentDetailModal from './components/DocumentDetailModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import Toast from './components/Toast.jsx';
import LoginPage from './components/LoginPage.jsx';
import SignUpPage from './components/SignUpPage.jsx';
import ForgotPasswordModal from './components/ForgotPasswordModal.jsx';
import { fetchCurrentUser, logoutUser } from './services/authService.js';
import {
  fetchDocuments,
  fetchDocumentStats,
  createDocument,
  updateDocument,
  deleteDocument
} from './services/documentService.js';

export default function App() {
  const queryClient = useQueryClient();

  // Auth navigation view state: 'login' | 'signup'
  const [authView, setAuthView] = useState('login');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  // 1. Session Query: Check authenticated session on initial load and page refresh
  const {
    data: currentUser,
    isLoading: isCheckingAuth
  } = useQuery({
    queryKey: ['auth', 'user'],
    queryFn: fetchCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000 // Cache session state for 5 minutes
  });

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

  const isFiltered = useMemo(() => {
    return Boolean(debouncedSearch.trim()) || category !== 'All';
  }, [debouncedSearch, category]);

  // 2. TanStack Query: Fetch paginated & filtered documents scoped to authenticated user
  const documentsQuery = useQuery({
    queryKey: ['documents', {
      userId: currentUser?.id,
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
    enabled: Boolean(currentUser),
    keepPreviousData: true,
    staleTime: 5000 // Keep fresh for 5 seconds
  });

  // 3. TanStack Query: Fetch dashboard document statistics scoped to authenticated user
  const statsQuery = useQuery({
    queryKey: ['documents', 'stats', currentUser?.id],
    queryFn: fetchDocumentStats,
    enabled: Boolean(currentUser),
    staleTime: 10000
  });

  // Handle expired sessions gracefully if document requests fail with 401
  useEffect(() => {
    if (
      documentsQuery.error?.response?.status === 401 ||
      statsQuery.error?.response?.status === 401
    ) {
      queryClient.clear();
      queryClient.setQueryData(['auth', 'user'], null);
      showToast('Your session has expired. Please log in again.', 'error');
    }
  }, [documentsQuery.error, statsQuery.error, queryClient, showToast]);

  // 4. TanStack Mutation: Create Document
  const createMutation = useMutation({
    mutationFn: createDocument,
    onSuccess: () => {
      showToast('Document created successfully!', 'success');
      setIsFormModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err) => {
      showToast(err.extractedMessage || 'Failed to create document', 'error');
    }
  });

  // 5. TanStack Mutation: Update Document
  const updateMutation = useMutation({
    mutationFn: updateDocument,
    onSuccess: () => {
      showToast('Document updated successfully!', 'success');
      setIsFormModalOpen(false);
      setEditingDocument(null);
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err) => {
      showToast(err.extractedMessage || 'Failed to update document', 'error');
    }
  });

  // 6. TanStack Mutation: Delete Document
  const deleteMutation = useMutation({
    mutationFn: deleteDocument,
    onSuccess: () => {
      showToast('Document deleted successfully!', 'success');
      setDeletingDocument(null);
      if (documentsQuery.data?.data?.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      }
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onError: (err) => {
      showToast(err.extractedMessage || 'Failed to delete document', 'error');
    }
  });

  // Auth event handlers
  const handleAuthSuccess = (user) => {
    queryClient.setQueryData(['auth', 'user'], user);
    queryClient.invalidateQueries({ queryKey: ['documents'] });
    showToast(`Welcome, ${user.name}!`, 'success');
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout network notice:', err.message);
    } finally {
      // Invalidate and clear all TanStack Query cache to avoid exposing stale user data
      queryClient.clear();
      queryClient.setQueryData(['auth', 'user'], null);
      setAuthView('login');
      showToast('Logged out successfully.', 'success');
    }
  };

  // Stable callbacks for DocumentList
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

  // ----------------------------------------------------
  // 1. Initial Authentication Check Splash Screen
  // ----------------------------------------------------
  if (isCheckingAuth) {
    return (
      <div className="auth-splash-screen">
        <div className="auth-splash-card">
          <div className="brand-icon auth-splash-icon">
            <FolderArchive size={32} />
          </div>
          <h2>FileHub</h2>
          <p className="auth-splash-sub">Smart File & Document Organizer</p>
          <div className="auth-splash-loading">
            <span className="spinner-sm" />
            <span>Verifying session...</span>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // 2. Unauthenticated View: Render Login or Sign Up
  // ----------------------------------------------------
  if (!currentUser) {
    return (
      <>
        {authView === 'signup' ? (
          <SignUpPage
            onSwitchToLogin={() => setAuthView('login')}
            onAuthSuccess={handleAuthSuccess}
          />
        ) : (
          <LoginPage
            onSwitchToSignUp={() => setAuthView('signup')}
            onAuthSuccess={handleAuthSuccess}
            onForgotPassword={() => setIsForgotModalOpen(true)}
          />
        )}

        <ForgotPasswordModal
          isOpen={isForgotModalOpen}
          onClose={() => setIsForgotModalOpen(false)}
        />

        <Toast toast={toast} onClose={() => setToast(null)} />
      </>
    );
  }

  // ----------------------------------------------------
  // 3. Authenticated View: Protected Dashboard
  // ----------------------------------------------------
  return (
    <div className="app-container">
      {/* Navigation Header with User Profile and Logout */}
      <Header
        onOpenAddModal={handleOpenAddModal}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {/* Category Statistics Cards */}
        <StatsOverview
          stats={statsQuery.data}
          selectedCategory={category}
          onSelectCategory={(cat) => {
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

/**
 * @file pages/company/CompanyInternshipsPage.jsx
 * @description Company Internship Management portal.
 * Enables employers to manage listings: search, status filter, in-memory create,
 * inline edit, and delete with modal confirmation.
 */

import { useMemo, useState } from 'react';
import DeleteConfirmModal from '../../components/company/DeleteConfirmModal.jsx';
import InternshipFormModal from '../../components/company/InternshipFormModal.jsx';
import { Badge, Button, Card } from '../../components/ui/index.js';
import { INITIAL_COMPANY_INTERNSHIPS } from '../../constants/mockCompanyInternships.js';

/* ── Inline SVG Icons ── */
function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clipRule="evenodd" />
    </svg>
  );
}

function PencilSquareIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
      <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022.841 10.518A2.75 2.75 0 0 0 7.596 19h4.807a2.75 2.75 0 0 0 2.742-2.53l.841-10.52.149.023a.75.75 0 0 0 .23-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 1 .75.75v7a.75.75 0 0 1-1.5 0v-7a.75.75 0 0 1 .75-.75Zm3.58.75a.75.75 0 0 0-1.5 0v7a.75.75 0 0 0 1.5 0v-7Z" clipRule="evenodd" />
    </svg>
  );
}

export function CompanyInternshipsPage() {
  const [internships, setInternships] = useState(INITIAL_COMPANY_INTERNSHIPS);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'active' | 'draft' | 'closed'

  // Modal States
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingPost, setDeletingPost] = useState(null);

  const [feedbackNotice, setFeedbackNotice] = useState('');

  const showNotice = (text) => {
    setFeedbackNotice(text);
    setTimeout(() => setFeedbackNotice(''), 3000);
  };

  // Filtered List
  const filteredList = useMemo(() => {
    return internships.filter((post) => {
      if (statusFilter !== 'All' && post.status !== statusFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesTitle = post.title.toLowerCase().includes(query);
        const matchesDept = post.department.toLowerCase().includes(query);
        const matchesLoc = post.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDept && !matchesLoc) return false;
      }
      return true;
    });
  }, [internships, statusFilter, searchTerm]);

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="success" dot size="sm">Active</Badge>;
      case 'draft':
        return <Badge variant="warning" dot size="sm">Draft</Badge>;
      case 'closed':
        return <Badge variant="danger" dot size="sm">Closed</Badge>;
      default:
        return <Badge variant="default" size="sm">{status}</Badge>;
    }
  };

  // Create or Update Action
  const handleSaveInternship = (formData) => {
    if (editingPost) {
      // Edit mode
      setInternships((prev) =>
        prev.map((item) =>
          item.id === editingPost.id
            ? { ...item, ...formData }
            : item
        )
      );
      showNotice(`Listing "${formData.title}" updated successfully.`);
    } else {
      // Create mode
      const newId = `post-${Date.now().toString().slice(-4)}`;
      const newEntry = {
        id: newId,
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        applicationsCount: 0,
      };
      setInternships((prev) => [newEntry, ...prev]);
      showNotice(`New internship "${formData.title}" published!`);
    }
    setEditingPost(null);
  };

  // Delete Action
  const handleConfirmDelete = () => {
    if (!deletingPost) return;
    setInternships((prev) => prev.filter((item) => item.id !== deletingPost.id));
    showNotice(`Internship "${deletingPost.title}" was deleted.`);
    setDeleteModalOpen(false);
    setDeletingPost(null);
  };

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Manage Internships
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Create, update, and manage your open internship roles and candidate pipelines.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => {
            setEditingPost(null);
            setFormModalOpen(true);
          }}
          className="shadow-xs self-start sm:self-auto"
        >
          <PlusIcon />
          <span>Post New Internship</span>
        </Button>
      </div>

      {/* ── Notice Toast ── */}
      {feedbackNotice && (
        <div
          role="status"
          className="p-3 bg-slate-900 text-white rounded-xl text-xs font-medium flex items-center gap-2 animate-in fade-in"
        >
          <span className="w-2 h-2 rounded-full bg-primary-400 shrink-0" />
          <span>{feedbackNotice}</span>
        </div>
      )}

      {/* ── Search & Status Filter Bar ── */}
      <Card variant="bordered" padding="md" className="bg-surface shadow-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search by role title or department…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-9 pr-3 rounded-lg border border-border bg-secondary-50/70 text-xs text-text-primary placeholder:text-text-muted focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-secondary-100 rounded-lg text-xs font-medium self-stretch sm:self-auto justify-center">
            {['All', 'active', 'draft', 'closed'].map((status) => {
              const label = status === 'All' ? 'All Roles' : status === 'active' ? 'Active' : status === 'draft' ? 'Draft' : 'Closed';
              const count =
                status === 'All'
                  ? internships.length
                  : internships.filter((item) => item.status === status).length;

              return (
                <button
                  key={status}
                  type="button"
                  onClick={() => setStatusFilter(status)}
                  className={[
                    'px-3 py-1.5 rounded-md transition-colors select-none flex items-center gap-1.5 text-xs',
                    statusFilter === status
                      ? 'bg-white text-text-primary font-bold shadow-2xs'
                      : 'text-text-muted hover:text-text-primary',
                  ].join(' ')}
                >
                  <span>{label}</span>
                  <span className="text-[10px] px-1 rounded-full bg-secondary-200/70 text-text-secondary">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ── Internships Management Table ── */}
      <div className="bg-surface border border-border rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary-50/70 text-[11px] font-semibold text-text-muted uppercase tracking-wider">
                <th scope="col" className="py-3 px-4 sm:px-6">Title & Department</th>
                <th scope="col" className="py-3 px-4 hidden md:table-cell">Location & Mode</th>
                <th scope="col" className="py-3 px-4">Posted Date</th>
                <th scope="col" className="py-3 px-4">Applications</th>
                <th scope="col" className="py-3 px-4">Status</th>
                <th scope="col" className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-xs">
              {filteredList.length > 0 ? (
                filteredList.map((post) => (
                  <tr key={post.id} className="hover:bg-secondary-50/50 transition-colors">
                    {/* Title & Department */}
                    <td className="py-4 px-4 sm:px-6">
                      <p className="font-bold text-sm text-text-primary">{post.title}</p>
                      <p className="text-text-muted text-[11px] mt-0.5">
                        {post.department} • {post.type}
                      </p>
                    </td>

                    {/* Location & Mode */}
                    <td className="py-4 px-4 hidden md:table-cell">
                      <p className="text-text-primary font-medium">{post.location}</p>
                      <span className="text-[11px] text-text-muted">{post.workMode}</span>
                    </td>

                    {/* Creation Date */}
                    <td className="py-4 px-4 text-text-secondary">
                      {post.createdAt}
                    </td>

                    {/* Applications Count */}
                    <td className="py-4 px-4">
                      <span className="font-bold text-text-primary text-sm">
                        {post.applicationsCount}
                      </span>{' '}
                      <span className="text-[11px] text-text-muted">applicants</span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {getStatusBadge(post.status)}
                    </td>

                    {/* Action Buttons (Edit & Delete) */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingPost(post);
                            setFormModalOpen(true);
                          }}
                          className="text-xs text-text-secondary hover:text-primary-600"
                          title="Edit posting"
                        >
                          <PencilSquareIcon />
                          <span className="hidden sm:inline">Edit</span>
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDeletingPost(post);
                            setDeleteModalOpen(true);
                          }}
                          className="text-xs text-danger-500 hover:text-danger-600 hover:bg-red-50"
                          title="Delete posting"
                        >
                          <TrashIcon />
                          <span className="hidden sm:inline">Delete</span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-text-muted">
                    <p className="text-sm font-semibold text-text-primary">No postings found</p>
                    <p className="text-xs text-text-secondary mt-1">
                      No internship posts match the selected status filter or search query.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-3 border-t border-border bg-secondary-50/40 text-xs text-text-muted flex items-center justify-between">
          <span>
            Total: <strong>{internships.length}</strong> postings ({internships.filter((i) => i.status === 'active').length} active)
          </span>
          <span className="text-[11px]">Local simulation mode — changes reset on page reload</span>
        </div>
      </div>

      {/* ── Create / Edit Form Modal ── */}
      <InternshipFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingPost(null);
        }}
        onSubmit={handleSaveInternship}
        initialData={editingPost}
      />

      {/* ── Delete Confirmation Dialog ── */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeletingPost(null);
        }}
        onConfirm={handleConfirmDelete}
        internshipTitle={deletingPost?.title}
      />
    </div>
  );
}

export default CompanyInternshipsPage;

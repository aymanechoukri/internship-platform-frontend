/**
 * @file components/company/DeleteConfirmModal.jsx
 * @description Accessible confirmation dialog for deleting an internship posting.
 */

import { Button } from '../ui/index.js';

function ExclamationTriangleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-danger-500">
      <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
    </svg>
  );
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  internshipTitle = '',
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
    >
      <div className="bg-surface rounded-2xl border border-border shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150 text-center">
        <div className="w-12 h-12 rounded-full bg-danger-50 flex items-center justify-center mx-auto mb-4">
          <ExclamationTriangleIcon />
        </div>

        <h3 id="delete-dialog-title" className="text-lg font-bold text-text-primary">
          Delete Internship Post?
        </h3>
        <p className="text-xs text-text-secondary mt-2 leading-relaxed">
          Are you sure you want to delete <strong className="text-text-primary">&ldquo;{internshipTitle}&rdquo;</strong>? This action cannot be undone and will remove all student applications associated with this post in this session.
        </p>

        <div className="flex items-center justify-center gap-3 mt-6 pt-4 border-t border-border">
          <Button type="button" variant="outline" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="danger" size="md" onClick={onConfirm}>
            Delete Posting
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;

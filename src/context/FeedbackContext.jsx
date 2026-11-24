/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const FeedbackContext = createContext(null);
let nextToastId = 0;
let nextDialogId = 0;

function ToastItem({ toast, onDismiss }) {
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 4200);
    return () => window.clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const styles = {
    success: "border-emerald-500/30 bg-surface text-text-primary",
    error: "border-danger-500/30 bg-surface text-text-primary",
    warning: "border-amber-500/30 bg-surface text-text-primary",
    info: "border-primary-500/30 bg-surface text-text-primary",
  };

  return (
    <div role={toast.type === "error" ? "alert" : "status"} className={`feedback-toast pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-xl ${styles[toast.type] || styles.info}`}>
      <span className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${toast.type === "success" ? "bg-emerald-500/15 text-emerald-600" : toast.type === "error" ? "bg-danger-500/15 text-danger-600" : toast.type === "warning" ? "bg-amber-500/15 text-amber-600" : "bg-primary-500/15 text-primary-600"}`}>
        {toast.type === "success" ? "✓" : toast.type === "error" ? "!" : toast.type === "warning" ? "⚠" : "i"}
      </span>
      <p className="flex-1 pt-1 text-sm leading-5">{toast.message}</p>
      <button type="button" onClick={() => onDismiss(toast.id)} className="rounded-lg px-1 text-lg leading-none text-text-muted transition hover:bg-secondary-100 hover:text-text-primary" aria-label="Dismiss notification">×</button>
    </div>
  );
}

function FeedbackDialog({ dialog, onClose }) {
  const [value, setValue] = useState(dialog?.defaultValue || "");

  useEffect(() => {
    if (!dialog) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialog, onClose]);

  if (!dialog) return null;

  const submit = (event) => {
    event?.preventDefault?.();
    if (dialog.kind === "prompt" && dialog.required && !value.trim()) return;
    onClose(dialog.kind === "prompt" ? value : true);
  };

  return (
    <div className="feedback-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(null); }}>
      <form onSubmit={submit} role="dialog" aria-modal="true" aria-labelledby="feedback-dialog-title" className="feedback-dialog w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-2xl">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-500/10 text-xl text-primary-600">{dialog.danger ? "!" : dialog.kind === "prompt" ? "✎" : "?"}</div>
        <h2 id="feedback-dialog-title" className="text-lg font-bold text-text-primary">{dialog.title}</h2>
        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-text-secondary">{dialog.message}</p>
        {dialog.kind === "prompt" && (
          <input autoFocus value={value} onChange={(event) => setValue(event.target.value)} placeholder={dialog.placeholder || "Enter a value"} className="mt-4 h-11 w-full rounded-xl border border-border bg-bg px-3 text-sm text-text-primary outline-none transition focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20" />
        )}
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => onClose(null)} className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-text-secondary transition hover:bg-secondary-100">{dialog.cancelText || "Cancel"}</button>
          <button type="submit" className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 ${dialog.danger ? "bg-danger-600 hover:bg-danger-700" : "bg-primary-600 hover:bg-primary-700"}`}>{dialog.confirmText || (dialog.kind === "prompt" ? "Continue" : "Confirm")}</button>
        </div>
      </form>
    </div>
  );
}

export function FeedbackProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [dialog, setDialog] = useState(null);

  const dismiss = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);
  const notify = useCallback((message, type = "success") => {
    if (!message) return;
    const id = ++nextToastId;
    setToasts((current) => [...current.slice(-3), { id, message: String(message), type }]);
  }, []);

  const ask = useCallback((kind, message, options = {}) => new Promise((resolve) => {
    setDialog({ id: ++nextDialogId, kind, message, resolve, ...options });
  }), []);

  const confirm = useCallback((message, options = {}) => ask("confirm", message, options), [ask]);
  const prompt = useCallback((message, options = {}) => ask("prompt", message, options), [ask]);

  const closeDialog = useCallback((result) => {
    setDialog((current) => {
      current?.resolve(result);
      return null;
    });
  }, []);

  return (
    <FeedbackContext.Provider value={{ notify, confirm, prompt }}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[110] flex w-[calc(100%-2rem)] flex-col items-end gap-3 sm:right-6 sm:top-6">
        {toasts.map((toast) => <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />)}
      </div>
      <FeedbackDialog key={dialog?.id ?? "closed"} dialog={dialog} onClose={closeDialog} />
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useFeedback must be used inside FeedbackProvider");
  return context;
}

import { useEffect, useRef } from "react";
import { cn } from "../../lib/cn";

export function Modal({ open, onClose, title, children, className }) {
  const overlayRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && panelRef.current) {
      panelRef.current.focus();
    }
  }, [open]);

  if (!open) return null;

  function handleBackdropClick(e) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "w-full max-w-lg rounded-xl bg-[var(--color-surface)] p-6 shadow-xl outline-none",
          className,
        )}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex min-h-11 min-w-11 items-center justify-center text-text-muted transition-colors duration-fast hover:text-text-primary"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="5" x2="15" y2="15" />
              <line x1="15" y1="5" x2="5" y2="15" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

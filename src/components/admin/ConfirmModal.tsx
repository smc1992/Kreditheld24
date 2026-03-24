'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Löschen',
  cancelText = 'Abbrechen',
  variant = 'danger',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Focus confirm button when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => confirmBtnRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const isDanger = variant === 'danger';

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === overlayRef.current) onCancel();
      }}
    >
      <div className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl ring-1 ring-slate-200 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className={`mx-auto h-14 w-14 rounded-full flex items-center justify-center mb-4 ${
            isDanger ? 'bg-red-100' : 'bg-amber-100'
          }`}>
            {isDanger ? (
              <Trash2 className="h-7 w-7 text-red-600" />
            ) : (
              <AlertTriangle className="h-7 w-7 text-amber-600" />
            )}
          </div>

          {/* Title & Message */}
          <h3 className="text-lg font-bold text-slate-900 text-center mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 text-center leading-relaxed">
            {message}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-2">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-200 transition-all disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 ${
              isDanger
                ? 'bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                : 'bg-amber-600 hover:bg-amber-700 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2'
            }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

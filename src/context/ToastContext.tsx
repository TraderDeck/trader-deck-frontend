import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export interface Toast {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'warning';
  duration?: number; // ms
}

interface ToastContextValue {
  toasts: Toast[];
  push: (toast: Omit<Toast, 'id'>) => void;
  remove: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const push = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    const full: Toast = { duration: 4000, type: 'info', ...toast, id };
    setToasts(t => [...t, full]);
    if (full.duration) {
      setTimeout(() => remove(id), full.duration);
    }
  }, [remove]);

  // Auto GC if >6 toasts
  useEffect(() => {
    if (toasts.length > 6) setToasts(t => t.slice(-6));
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, push, remove }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 w-72">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-start p-3 rounded shadow text-sm text-white animate-fade-in bg-opacity-90 backdrop-blur-sm cursor-pointer transition hover:brightness-110 ${
              t.type === 'success' ? 'bg-green-600' :
              t.type === 'error' ? 'bg-red-600' :
              t.type === 'warning' ? 'bg-yellow-600' : 'bg-gray-700'
            }`} onClick={() => remove(t.id)}>
            <span className="flex-1 leading-snug">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

// Simple animation styles (can be moved to global CSS)
// Add this snippet to index.css if desired:
// .animate-fade-in { animation: fade-in .25s ease-out; }
// @keyframes fade-in { from { opacity:0; transform: translateY(4px);} to { opacity:1; transform:translateY(0);} }

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { soundEffects } from '../utils/soundEffects';

export type ToastType = 'success' | 'info' | 'warning' | 'error';

export interface ToastItem {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  showToast: (options: { title: string; message?: string; type?: ToastType; duration?: number }) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      title,
      message,
      type = 'info',
      duration = 4000,
    }: {
      title: string;
      message?: string;
      type?: ToastType;
      duration?: number;
    }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newToast: ToastItem = { id, title, message, type, duration };

      // Play audio feedback based on toast type
      if (type === 'success') {
        soundEffects.playSuccess();
      } else if (type === 'error') {
        soundEffects.playError();
      } else {
        soundEffects.playClick();
      }

      setToasts((prev) => [...prev.slice(-3), newToast]); // Limit to max 4 concurrent toasts

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

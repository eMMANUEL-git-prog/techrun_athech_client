'use client';

import { useEffect, useState } from 'react';
import { Toast, subscribeToToasts } from '@/lib/toast';

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToToasts((toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    });

    return unsubscribe;
  }, []);

  const getToastColor = (type: string) => {
    const colors: Record<string, string> = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      info: 'bg-blue-500',
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${getToastColor(toast.type)} text-white px-4 py-3 rounded-lg shadow-lg animate-in fade-in-0 slide-in-from-bottom-2`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

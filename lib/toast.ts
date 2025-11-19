type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

let toastListeners: ((toast: Toast) => void)[] = [];
let toastId = 0;

export const showToast = (message: string, type: ToastType = 'info'): void => {
  const id = String(++toastId);
  const toast: Toast = { id, message, type };
  toastListeners.forEach((listener) => listener(toast));
  setTimeout(() => {
    removeToast(id);
  }, 3000);
};

export const removeToast = (id: string): void => {
  // Toast will be removed by the component
};

export const subscribeToToasts = (listener: (toast: Toast) => void): (() => void) => {
  toastListeners.push(listener);
  return () => {
    toastListeners = toastListeners.filter((l) => l !== listener);
  };
};

export type { Toast, ToastType };

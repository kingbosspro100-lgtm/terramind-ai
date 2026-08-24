"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

const toastState: { messages: ToastMessage[]; listeners: Set<Function> } = {
  messages: [],
  listeners: new Set(),
};

export const showToast = (message: string, type: ToastType = "info", duration = 3000) => {
  const id = Date.now().toString();
  const toast = { id, message, type, duration };
  toastState.messages.push(toast);
  toastState.listeners.forEach(listener => listener());

  if (duration > 0) {
    setTimeout(() => {
      toastState.messages = toastState.messages.filter(t => t.id !== id);
      toastState.listeners.forEach(listener => listener());
    }, duration);
  }
};

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const listener = () => setToasts([...toastState.messages]);
    toastState.listeners.add(listener);
    return () => {
      toastState.listeners.delete(listener);
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-3 rounded-2xl px-6 py-4 text-sm font-semibold text-white backdrop-blur-sm border animate-in fade-in slide-in-from-right-4 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-600/90 border-emerald-500/50"
              : toast.type === "error"
              ? "bg-red-600/90 border-red-500/50"
              : "bg-blue-600/90 border-blue-500/50"
          }`}
        >
          {toast.type === "success" && <CheckCircle2 className="h-5 w-5 shrink-0" />}
          {toast.type === "error" && <AlertCircle className="h-5 w-5 shrink-0" />}
          <span>{toast.message}</span>
          <button
            onClick={() => {
              toastState.messages = toastState.messages.filter(t => t.id !== toast.id);
              setToasts([...toastState.messages]);
            }}
            className="ml-auto p-1 hover:bg-white/20 rounded-lg transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

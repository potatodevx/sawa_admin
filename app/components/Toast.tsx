"use client";

import { useEffect, useState, useCallback, createContext, useContext, ReactNode, useRef } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  exiting: boolean;
}

interface ToastContextType {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

let counter = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
  }, []);

  const toast = useCallback((message: string, type: ToastType = "info") => {
    const id = ++counter;
    setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    setTimeout(() => dismiss(id), 3500);
  }, [dismiss]);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div style={{
        position: "fixed",
        bottom: "1.5rem",
        right: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.6rem",
        zIndex: 99999,
        pointerEvents: "none",
      }}>
        {toasts.map((t) => (
          <ToastBubble key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastBubble({ toast: t, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  const colors = {
    success: { bg: "#14532d", border: "#16a34a", icon: "✓", iconColor: "#4ade80" },
    error:   { bg: "#450a0a", border: "#dc2626", icon: "✕", iconColor: "#f87171" },
    info:    { bg: "#1e1b4b", border: "#6366f1", icon: "i", iconColor: "#818cf8" },
  };
  const c = colors[t.type];

  return (
    <div
      onClick={onDismiss}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        borderRadius: "12px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        color: "#f1f5f9",
        fontSize: "0.875rem",
        fontWeight: 500,
        minWidth: "260px",
        maxWidth: "380px",
        cursor: "pointer",
        pointerEvents: "all",
        opacity: t.exiting ? 0 : 1,
        transform: t.exiting ? "translateX(20px)" : "translateX(0)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
        backdropFilter: "blur(10px)",
      }}
    >
      <span style={{
        width: 22, height: 22, borderRadius: "50%",
        background: `${c.border}33`,
        border: `1.5px solid ${c.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.75rem", fontWeight: 700, color: c.iconColor,
        flexShrink: 0,
      }}>
        {c.icon}
      </span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{t.message}</span>
    </div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx.toast;
}

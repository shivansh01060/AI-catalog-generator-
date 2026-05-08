import { useState, useEffect } from "react";

function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: { bg: "rgba(16,185,129,0.15)", border: "#10b981", icon: "✅" },
    error: { bg: "rgba(239,68,68,0.15)", border: "#ef4444", icon: "❌" },
    info: { bg: "rgba(99,57,255,0.15)", border: "#6339ff", icon: "ℹ️" },
    loading: { bg: "rgba(0,200,255,0.15)", border: "#00c8ff", icon: "⏳" },
  };

  const style = colors[type] || colors.info;

  return (
    <div
      className="fixed z-50 flex items-center gap-3 px-4 py-3 md:px-5 md:py-4 rounded-2xl shadow-2xl mx-4 md:mx-0"
      style={{
        bottom: "calc(16px + env(safe-area-inset-bottom, 0px))",
        left: "50%",
        transform: "translateX(-50%)",
        background: style.bg,
        border: `1px solid ${style.border}`,
        backdropFilter: "blur(20px)",
        minWidth: "260px",
        maxWidth: "calc(100vw - 32px)",
        width: "max-content",
        animation: "slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
      `}</style>
      <span className="text-lg flex-shrink-0">{style.icon}</span>
      <p className="text-sm font-medium text-white flex-1">{message}</p>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white transition flex-shrink-0 text-xs p-1 active:scale-95"
      >
        ✕
      </button>
    </div>
  );
}

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  const hideToast = () => setToast(null);

  const ToastComponent = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={hideToast} />
  ) : null;

  return { showToast, ToastComponent };
}

export default Toast;

import { toast } from "react-toastify";

/**
 * Show a toast notification using Toastify
 * Usage: showToast("Message here", "success");
 * Types: "success", "error", "info", "warning"
 */
export const showToast = (message, type = "info", duration = 3000) => {
  toast[type](message, {
    position: "top-right",
    autoClose: duration,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
};

// Keep old exports for backward compatibility (unused now)
export const ToastContainer = () => null;
export const useToast = () => ({
  showToast,
});

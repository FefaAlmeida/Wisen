"use client";

import { Toast } from "@base-ui/react/toast";

export const toastManager = Toast.createToastManager();

export const toast = {
  success(title, options) {
    return toastManager.add({ title, type: "success", ...options });
  },
  error(title) {
    return toastManager.add({ title, type: "error", priority: "high", timeout: 8000 });
  },
  close(id) {
    toastManager.close(id);
  },
};

"use client";

import { Toast } from "@base-ui/react/toast";
import { Check, CircleAlert, X } from "lucide-react";
import { toastManager } from "@/lib/toast";

const toastStyles = {
  success: {
    surface: "border-emerald-300 border-s-emerald-700 bg-emerald-100 text-emerald-950",
    icon: "bg-emerald-700",
    close: "hover:bg-emerald-200",
  },
  error: {
    surface: "border-red-300 border-s-red-700 bg-red-100 text-red-950",
    icon: "bg-red-700",
    close: "hover:bg-red-200",
  },
};

function ToastViewport() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Portal>
      <Toast.Viewport
        aria-label="Notificações"
        className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-[100] flex flex-col-reverse gap-2 outline-none sm:right-6 sm:bottom-6 sm:left-auto sm:w-96"
      >
        {toasts.map((item) => {
          const isError = item.type === "error";
          const Icon = isError ? CircleAlert : Check;
          const styles = isError ? toastStyles.error : toastStyles.success;

          return (
            <Toast.Root
              key={item.id}
              toast={item}
              role={isError ? "alertdialog" : "group"}
              swipeDirection="right"
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border border-s-4 p-3 shadow-lg shadow-wisen-titulo/10 outline-none focus-visible:ring-2 focus-visible:ring-current data-limited:hidden ${styles.surface}`}
            >
              <span
                className={`grid size-7 shrink-0 place-items-center rounded-full text-white ${styles.icon}`}
              >
                <Icon aria-hidden="true" size={16} />
              </span>
              <Toast.Content className="min-w-0 flex-1 self-center">
                <Toast.Title className="text-sm leading-5 font-medium wrap-break-word" />
                {item.actionProps && (
                  <Toast.Action className="mt-2 rounded-sm text-sm font-semibold underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-current" />
                )}
              </Toast.Content>
              <Toast.Close
                aria-label="Fechar notificação"
                className={`grid size-7 shrink-0 cursor-pointer place-items-center rounded-md focus-visible:outline-2 focus-visible:outline-current ${styles.close}`}
              >
                <X aria-hidden="true" size={16} />
              </Toast.Close>
            </Toast.Root>
          );
        })}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export function ToastProvider({ children }) {
  return (
    <Toast.Provider toastManager={toastManager}>
      {children}
      <ToastViewport />
    </Toast.Provider>
  );
}

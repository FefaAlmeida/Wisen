"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "cn";
import { XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dialogPrimaryAction =
  "h-auto min-h-11 rounded-xl bg-[#101A40] px-5 py-2.5 text-sm font-medium whitespace-normal text-white hover:bg-[#30466E] disabled:bg-[#E8ECF3] disabled:text-[#93A3BE] disabled:opacity-100";
export const dialogSecondaryAction =
  "h-auto min-h-11 rounded-xl border-wisen-borda bg-white px-4 py-2.5 text-sm font-medium whitespace-normal text-[#7182A1] hover:bg-[#F1F3F6]";

function Dialog(props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
function DialogTrigger(props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}
function DialogPortal(props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
function DialogClose(props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}
function DialogOverlay({ className, ...props }) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-[#101A40]/20 duration-100 supports-backdrop-filter:backdrop-blur-[2px] data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}
const widths = {
  sm: "sm:max-w-md",
  md: "sm:max-w-xl",
  lg: "sm:max-w-2xl",
  xl: "sm:max-w-3xl",
  wide: "sm:max-w-4xl",
};
function DialogContent({
  className,
  children,
  size = "md",
  showCloseButton = true,
  closeLabel = "Fechar",
  ...props
}) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        className={cn(
          "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col gap-0 overflow-hidden rounded-2xl border border-[#DCE3ED] bg-white p-0 text-sm text-wisen-titulo shadow-[0_24px_80px_-24px_rgba(16,26,64,0.3)] outline-none transition-[opacity,transform] duration-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          widths[size],
          className,
        )}
        {...props}
      >
        <div data-slot="dialog-accent" aria-hidden="true" className="h-1 shrink-0 bg-[#E8E191]" />
        {children}
        {showCloseButton && (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={
              <Button
                variant="ghost"
                className="absolute top-4 right-4 size-8 rounded-lg text-[#7182A1] hover:bg-[#F1F3F6]"
                size="icon-sm"
              />
            }
          >
            <XIcon aria-hidden="true" />
            <span className="sr-only">{closeLabel}</span>
          </DialogPrimitive.Close>
        )}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
}
function DialogHeader({ className, eyebrow = "Wisen", children, ...props }) {
  return (
    <div
      data-slot="dialog-header"
      className={cn(
        "flex shrink-0 flex-col gap-0 border-b border-[#E8EDF4] px-5 pt-5 pb-5 sm:px-8 sm:pt-6 [@media(max-height:600px)]:pt-3 [@media(max-height:600px)]:pb-3",
        className,
      )}
      {...props}
    >
      {eyebrow && (
        <p className="mb-4 pr-8 text-[10px] font-semibold tracking-[0.12em] text-[#93A3BE] uppercase [@media(max-height:600px)]:mb-2">
          {eyebrow}
        </p>
      )}
      {children}
    </div>
  );
}
function DialogBody({ className, ...props }) {
  return (
    <div
      data-slot="dialog-body"
      className={cn(
        "min-h-0 min-w-0 flex-auto overflow-y-auto overscroll-contain bg-[#F8FAFD] px-5 py-5 [scrollbar-color:#BDC7D6_transparent] [scrollbar-width:thin] sm:px-8 [@media(max-height:600px)]:py-3",
        className,
      )}
      {...props}
    />
  );
}
function DialogForm({ className, ...props }) {
  return (
    <form
      data-slot="dialog-form"
      className={cn("flex min-h-0 min-w-0 flex-col overflow-hidden", className)}
      {...props}
    />
  );
}
function DialogFooter({ className, showCloseButton = false, children, ...props }) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex shrink-0 flex-col-reverse flex-wrap gap-3 border-t border-[#E8EDF4] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-8 [@media(max-height:600px)]:py-3",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          render={<Button variant="outline" className={dialogSecondaryAction} />}
        >
          Fechar
        </DialogPrimitive.Close>
      )}
    </div>
  );
}
function DialogTitle({ className, ...props }) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn(
        "break-words text-[26px] font-medium leading-[1.15] tracking-tight text-wisen-titulo sm:text-[32px] [@media(max-height:600px)]:text-[22px]",
        className,
      )}
      {...props}
    />
  );
}
function DialogDescription({ className, ...props }) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "mt-3 max-w-prose text-[13px] leading-6 text-[#7182A1] *:[a]:underline *:[a]:underline-offset-3 [@media(max-height:600px)]:mt-2 [@media(max-height:600px)]:leading-5",
        className,
      )}
      {...props}
    />
  );
}

export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogForm,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};

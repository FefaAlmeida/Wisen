import { render } from "@testing-library/react";
import { ToastProvider } from "@/components/ui/toast";

export function renderWithToasts(component) {
  return render(component, { wrapper: ToastProvider });
}

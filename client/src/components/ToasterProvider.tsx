import { Toaster } from 'sonner';

export function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      expand
      theme="light"
      visibleToasts={3}
      gap={12}
    />
  );
}
import Toast from '@/components/ui/Toast'
import { useUiStore } from '@/features/tickets/store/uiStore'

export default function ToastViewport() {
  const toasts = useUiStore((state) => state.toasts)
  const dismissToast = useUiStore((state) => state.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 left-4 right-4 z-50 flex flex-col gap-2 md:left-auto md:w-80"
    >
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          tone={toast.tone}
          onDismiss={() => dismissToast(toast.id)}
        />
      ))}
    </div>
  )
}

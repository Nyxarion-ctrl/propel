"use client"

import { useEffect } from "react"
import { CheckCircle2 } from "lucide-react"

export function Toast({
  message,
  onDismiss,
}: {
  message: string | null
  onDismiss: () => void
}) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDismiss, 2600)
    return () => clearTimeout(t)
  }, [message, onDismiss])

  if (!message) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className="print-hidden fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-lg animate-in fade-in slide-in-from-bottom-4"
    >
      <CheckCircle2 className="h-4 w-4 text-primary" />
      {message}
    </div>
  )
}

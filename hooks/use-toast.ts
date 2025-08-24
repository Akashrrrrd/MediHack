"use client"

import { useState, useCallback } from "react"

export interface Toast {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
  duration?: number
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback(({ title, description, variant = "default", duration = 5000 }: Omit<Toast, "id">) => {
    const id = (++toastCount).toString()
    const newToast: Toast = { id, title, description, variant, duration }

    setToasts((prev) => [...prev, newToast])

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, duration)

    return id
  }, [])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}

// Simple toast function for direct use
export const toast = ({ title, description, variant = "default", duration = 5000 }: Omit<Toast, "id">) => {
  // In a real implementation, this would integrate with a toast provider
  // For now, we'll use browser notifications as fallback
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title || "Notification", {
      body: description,
      icon: "/favicon.ico",
    })
  } else {
    console.log(`Toast: ${title} - ${description}`)
  }
}
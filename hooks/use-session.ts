"use client"

import { useState, useEffect } from "react"
import { SessionStorage, type UserSession } from "@/lib/storage"

export function useSession() {
  const [session, setSessionState] = useState<UserSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load session on mount
    const savedSession = SessionStorage.getSession()
    setSessionState(savedSession)
    setIsLoading(false)
  }, [])

  const updateSession = (updates: Partial<UserSession>) => {
    SessionStorage.saveSession(updates)
    const updatedSession = SessionStorage.getSession()
    setSessionState(updatedSession)
  }

  const clearSession = () => {
    SessionStorage.clearSession()
    setSessionState(null)
  }

  const hasValidSession = SessionStorage.hasValidSession()

  return {
    session,
    updateSession,
    clearSession,
    hasValidSession,
    isLoading,
  }
}

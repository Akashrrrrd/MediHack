"use client"

import { useEffect, useState, useCallback } from "react"

interface RealtimeUpdate {
  type: string
  data: any
  timestamp: string
}

export function useRealtimeUpdates(endpoint: string, params?: Record<string, string>) {
  const [data, setData] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const connect = useCallback(() => {
    const searchParams = new URLSearchParams(params)
    const url = `${endpoint}?${searchParams.toString()}`

    const eventSource = new EventSource(url)

    eventSource.onopen = () => {
      setIsConnected(true)
      setError(null)
    }

    eventSource.onmessage = (event) => {
      try {
        const update: RealtimeUpdate = JSON.parse(event.data)
        setData(update)
        setLastUpdate(new Date())
      } catch (err) {
        console.error("Error parsing realtime update:", err)
        setError("Failed to parse update")
      }
    }

    eventSource.onerror = () => {
      setIsConnected(false)
      setError("Connection lost")
      eventSource.close()

      setTimeout(connect, 1000)
    }

    return eventSource
  }, [endpoint, params])

  useEffect(() => {
    const eventSource = connect()

    return () => {
      eventSource?.close()
      setIsConnected(false)
    }
  }, [connect])

  return { data, isConnected, error, lastUpdate }
}

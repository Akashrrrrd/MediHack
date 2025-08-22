"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { AIService } from "@/lib/ai-service"
import type { QueueEntry, AIWaitTimePrediction } from "@/lib/types"

interface UseAIPredictionsProps {
  hospitalId?: number
  departmentId?: number
  refreshInterval?: number // milliseconds
}

interface QueueEntryWithPrediction extends QueueEntry {
  prediction?: AIWaitTimePrediction
}

export function useAIPredictions({
  hospitalId,
  departmentId,
  refreshInterval = 30000, // 30 seconds default
}: UseAIPredictionsProps = {}) {
  const [queue, setQueue] = useState<QueueEntryWithPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  const fetchQueueData = useCallback(async () => {
    try {
      setError(null)
      setIsUpdating(true)
      const data = await AIService.getQueueWithPredictions(hospitalId, departmentId)

      if (data) {
        setQueue(data.queue)
        setLastUpdated(new Date())
      } else {
        setError("Failed to fetch queue data")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
      setIsUpdating(false)
    }
  }, [hospitalId, departmentId])

  const refreshPrediction = useCallback(async (queueEntryId: number) => {
    try {
      setIsUpdating(true)
      const prediction = await AIService.getPrediction(queueEntryId, true)

      if (prediction) {
        setQueue((prevQueue) =>
          prevQueue.map((entry) => (entry.id === queueEntryId ? { ...entry, prediction } : entry)),
        )
        setLastUpdated(new Date())
      }
    } catch (err) {
      console.error("[v0] Failed to refresh prediction:", err)
    } finally {
      setIsUpdating(false)
    }
  }, [])

  const addPatient = useCallback(
    async (patientData: {
      name: string
      phone?: string
      age?: number
      symptoms: string
      priority_level: 1 | 2 | 3 | 4
      hospital_id: number
      department_id: number
    }) => {
      try {
        setIsUpdating(true)
        const result = await AIService.addPatientWithPrediction(patientData)

        if (result) {
          // Refresh the entire queue to get updated predictions
          await fetchQueueData()
          return result
        }

        throw new Error("Failed to add patient")
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to add patient")
        return null
      } finally {
        setIsUpdating(false)
      }
    },
    [fetchQueueData],
  )

  // Initial load
  useEffect(() => {
    fetchQueueData()
  }, [fetchQueueData])

  useEffect(() => {
    if (refreshInterval > 0) {
      // Use shorter interval for patient dashboard (5 seconds) vs admin (10 seconds)
      const actualInterval = refreshInterval < 20000 ? Math.max(5000, refreshInterval) : refreshInterval
      const interval = setInterval(fetchQueueData, actualInterval)
      return () => clearInterval(interval)
    }
  }, [fetchQueueData, refreshInterval])

  // Calculate statistics with memoization for instant updates
  const stats = useMemo(
    () => ({
      totalWaiting: queue.length,
      emergencyCases: queue.filter((entry) => entry.priority_level === 1).length,
      averageWaitTime:
        queue.length > 0
          ? Math.round(queue.reduce((sum, entry) => sum + (entry.prediction?.estimatedWaitTime || 0), 0) / queue.length)
          : 0,
      longestWait: Math.max(...queue.map((entry) => entry.prediction?.estimatedWaitTime || 0), 0),
    }),
    [queue],
  )

  return {
    queue,
    loading,
    error,
    lastUpdated,
    stats,
    refreshPrediction,
    addPatient,
    refetch: fetchQueueData,
    isUpdating,
  }
}

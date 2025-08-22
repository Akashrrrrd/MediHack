"use client"

import { useEffect, useState } from "react"
import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"
import { toast } from "@/hooks/use-toast"
import { Bell } from "lucide-react"

interface LiveNotificationsProps {
  hospitalId: string
  patientId?: string
  isAdmin?: boolean
}

export function LiveNotifications({ hospitalId, patientId, isAdmin }: LiveNotificationsProps) {
  const [lastNotification, setLastNotification] = useState<string>("")

  const { data: queueData } = useRealtimeUpdates("/api/realtime/queue-updates", {
    hospitalId,
    ...(patientId && { patientId }),
  })

  const { data: emergencyData } = useRealtimeUpdates("/api/realtime/emergency-alerts", { hospitalId })

  // Handle queue position updates for patients
  useEffect(() => {
    if (queueData && patientId && queueData.type === "patient_update") {
      const notificationKey = `position-${queueData.position}-${queueData.timestamp}`

      if (notificationKey !== lastNotification) {
        if (queueData.position <= 3) {
          toast({
            title: "You're almost up!",
            description: `You are #${queueData.position} in line. Please prepare for your appointment.`,
            duration: 8000,
          })
        } else if (queueData.position <= 10) {
          toast({
            title: "Queue Update",
            description: `You are now #${queueData.position} in line.`,
            duration: 5000,
          })
        }
        setLastNotification(notificationKey)
      }
    }
  }, [queueData, patientId, lastNotification])

  // Handle emergency alerts for admins
  useEffect(() => {
    if (emergencyData && isAdmin && emergencyData.criticalCases?.length > 0) {
      const notificationKey = `emergency-${emergencyData.count}-${emergencyData.timestamp}`

      if (notificationKey !== lastNotification) {
        toast({
          title: "🚨 Critical Emergency Alert",
          description: `${emergencyData.count} critical patients require immediate attention.`,
          variant: "destructive",
          duration: 10000,
        })
        setLastNotification(notificationKey)
      }
    }
  }, [emergencyData, isAdmin, lastNotification])

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-lg px-3 py-2 shadow-lg">
        <Bell className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">Live Updates</span>
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, X, Bell, Heart, Clock } from "lucide-react"

interface EmergencyAlert {
  id: string
  type: "critical" | "urgent" | "escalation"
  message: string
  patientId?: number
  timestamp: Date
  acknowledged: boolean
  protocol?: string
}

interface EmergencyAlertSystemProps {
  hospitalId: number
}

export function EmergencyAlertSystem({ hospitalId }: EmergencyAlertSystemProps) {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)

  // Mock alert generation for demo
  useEffect(() => {
    const generateMockAlert = () => {
      const alertTypes = ["critical", "urgent", "escalation"] as const
      const messages = [
        "Patient in cardiac arrest - Code Blue activated",
        "Stroke alert - Patient requires immediate CT scan",
        "Patient waiting over 2 hours with chest pain",
        "Oxygen saturation below 90% - immediate attention required",
        "Trauma alert - Multiple injuries incoming",
      ]

      const newAlert: EmergencyAlert = {
        id: Date.now().toString(),
        type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        patientId: Math.floor(Math.random() * 100) + 1,
        timestamp: new Date(),
        acknowledged: false,
        protocol: Math.random() > 0.5 ? "Emergency Protocol Active" : undefined,
      }

      setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]) // Keep only 5 most recent

      // Play alert sound
      if (soundEnabled && newAlert.type === "critical") {
        playAlertSound()
      }
    }

    // Generate initial alerts
    generateMockAlert()

    // Generate new alerts periodically for demo
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance every 30 seconds
        generateMockAlert()
      }
    }, 30000)

    return () => clearInterval(interval)
  }, [soundEnabled])

  const playAlertSound = () => {
    // In a real implementation, this would play an actual alert sound
    console.log("[v0] Emergency alert sound would play here")
  }

  const acknowledgeAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return Heart
      case "urgent":
        return AlertTriangle
      case "escalation":
        return Clock
      default:
        return Bell
    }
  }

  const getAlertVariant = (type: string) => {
    switch (type) {
      case "critical":
        return "destructive"
      case "urgent":
        return "default"
      case "escalation":
        return "default"
      default:
        return "default"
    }
  }

  const unacknowledgedAlerts = alerts.filter((alert) => !alert.acknowledged)

  if (alerts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
      {/* Alert Counter */}
      {unacknowledgedAlerts.length > 0 && (
        <div className="bg-destructive text-destructive-foreground px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
          <Bell className="w-4 h-4" />
          <span className="font-medium">
            {unacknowledgedAlerts.length} Active Emergency Alert{unacknowledgedAlerts.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Alert List */}
      {alerts.slice(0, 3).map((alert) => {
        const AlertIcon = getAlertIcon(alert.type)

        return (
          <Alert
            key={alert.id}
            variant={getAlertVariant(alert.type)}
            className={`shadow-lg border-2 ${!alert.acknowledged ? "animate-pulse" : "opacity-75"}`}
          >
            <AlertIcon className="h-4 w-4" />
            <AlertDescription className="pr-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant={alert.type === "critical" ? "destructive" : "secondary"}>
                    {alert.type.toUpperCase()}
                  </Badge>
                  {alert.protocol && (
                    <Badge variant="outline" className="text-xs">
                      {alert.protocol}
                    </Badge>
                  )}
                </div>
                <div className="font-medium">{alert.message}</div>
                {alert.patientId && <div className="text-sm opacity-75">Patient ID: {alert.patientId}</div>}
                <div className="text-xs opacity-75">{alert.timestamp.toLocaleTimeString()}</div>
                <div className="flex gap-2 mt-2">
                  {!alert.acknowledged && (
                    <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                      Acknowledge
                    </Button>
                  )}
                  <Button size="sm" variant="ghost" onClick={() => dismissAlert(alert.id)}>
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )
      })}

      {/* Sound Toggle */}
      <div className="flex justify-end">
        <Button size="sm" variant="ghost" onClick={() => setSoundEnabled(!soundEnabled)} className="text-xs">
          <Bell className={`w-3 h-3 mr-1 ${soundEnabled ? "" : "opacity-50"}`} />
          Sound {soundEnabled ? "On" : "Off"}
        </Button>
      </div>
    </div>
  )
}

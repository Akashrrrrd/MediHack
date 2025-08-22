"use client"

import { useRealtimeUpdates } from "@/hooks/use-realtime-updates"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users, AlertTriangle } from "lucide-react"

interface QueueStatusProps {
  hospitalId: string
  patientId?: string
}

export function RealtimeQueueStatus({ hospitalId, patientId }: QueueStatusProps) {
  const { data: queueData, isConnected } = useRealtimeUpdates("/api/realtime/queue-updates", {
    hospitalId,
    ...(patientId && { patientId }),
  })

  const { data: emergencyData } = useRealtimeUpdates("/api/realtime/emergency-alerts", { hospitalId })

  return (
    <div className="space-y-4">
      {/* Connection Status */}
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
        <span className="text-sm text-muted-foreground">{isConnected ? "Live Updates Active" : "Reconnecting..."}</span>
      </div>

      {/* Emergency Alerts */}
      {emergencyData?.criticalCases?.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-4 h-4" />
              Critical Emergency Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-red-600">
              {emergencyData.criticalCases.length} critical patients require immediate attention
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Status */}
      {queueData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {patientId ? (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Your Position
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">#{queueData.position || "N/A"}</div>
                <div className="text-sm text-muted-foreground">in queue</div>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Total Patients
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{queueData.queueStatus?.totalPatients || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Avg Wait Time
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{queueData.queueStatus?.avgWaitTime || 0}m</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Priority Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Badge variant="destructive">{queueData.queueStatus?.criticalCount || 0} Critical</Badge>
                    <Badge variant="secondary">{queueData.queueStatus?.urgentCount || 0} Urgent</Badge>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  )
}

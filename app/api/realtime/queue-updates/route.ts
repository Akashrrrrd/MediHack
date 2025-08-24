import { type NextRequest } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hospitalId = searchParams.get("hospitalId")
  const patientId = searchParams.get("patientId")

  // Set up Server-Sent Events
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      const sendUpdate = async () => {
        try {
          let data: any = {}

          if (patientId) {
            // Get patient-specific updates
            const queueEntry = await DatabaseService.getQueueEntry(Number.parseInt(patientId))
            if (queueEntry) {
              const queueEntries = await DatabaseService.getQueueEntries(queueEntry.hospital_id, queueEntry.department_id)
              const position = queueEntries.findIndex(entry => entry.id === queueEntry.id) + 1
              
              data = {
                type: "patient_update",
                position,
                estimatedWaitTime: queueEntry.estimated_wait_time,
                status: queueEntry.status,
                timestamp: new Date().toISOString()
              }
            }
          } else if (hospitalId) {
            // Get hospital-wide updates
            const queueEntries = await DatabaseService.getQueueEntries(Number.parseInt(hospitalId))
            
            data = {
              type: "queue_status",
              queueStatus: {
                totalPatients: queueEntries.length,
                avgWaitTime: Math.round(
                  queueEntries.reduce((sum, entry) => sum + (entry.estimated_wait_time || 0), 0) / 
                  (queueEntries.length || 1)
                ),
                criticalCount: queueEntries.filter(entry => entry.priority_level === 1).length,
                urgentCount: queueEntries.filter(entry => entry.priority_level === 2).length,
              },
              timestamp: new Date().toISOString()
            }
          }

          const message = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(message))
        } catch (error) {
          console.error("Error sending queue update:", error)
        }
      }

      // Send initial update
      sendUpdate()

      // Send updates every 5 seconds
      const interval = setInterval(sendUpdate, 5000)

      // Cleanup function
      return () => {
        clearInterval(interval)
      }
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}
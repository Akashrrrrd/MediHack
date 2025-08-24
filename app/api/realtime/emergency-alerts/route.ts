import { type NextRequest } from "next/server"
import { DatabaseService } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hospitalId = searchParams.get("hospitalId")

  if (!hospitalId) {
    return new Response("Hospital ID required", { status: 400 })
  }

  // Set up Server-Sent Events
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      const sendEmergencyUpdate = async () => {
        try {
          const queueEntries = await DatabaseService.getQueueEntries(Number.parseInt(hospitalId))
          const emergencyCases = queueEntries.filter(entry => entry.priority_level === 1)
          
          // Check for critical cases (waiting > 15 minutes)
          const criticalCases = emergencyCases.filter(entry => {
            const waitTime = Math.floor((Date.now() - new Date(entry.arrival_time).getTime()) / 60000)
            return waitTime > 15
          })

          const data = {
            type: "emergency_alert",
            criticalCases: criticalCases.map(entry => ({
              id: entry.id,
              patientName: entry.patient?.name,
              symptoms: entry.symptoms,
              waitTime: Math.floor((Date.now() - new Date(entry.arrival_time).getTime()) / 60000),
              department: entry.department?.name
            })),
            totalEmergencies: emergencyCases.length,
            timestamp: new Date().toISOString()
          }

          const message = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(message))
        } catch (error) {
          console.error("Error sending emergency alert:", error)
        }
      }

      // Send initial update
      sendEmergencyUpdate()

      // Send updates every 10 seconds for emergency alerts
      const interval = setInterval(sendEmergencyUpdate, 10000)

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
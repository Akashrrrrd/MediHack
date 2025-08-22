import type { NextRequest } from "next/server"
import { getQueueStatus, getPatientPosition } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get("patientId")
  const hospitalId = searchParams.get("hospitalId")

  // Set up Server-Sent Events
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const sendUpdate = async () => {
        try {
          if (patientId) {
            // Send patient-specific updates
            const position = await getPatientPosition(Number.parseInt(patientId))
            const data = `data: ${JSON.stringify({
              type: "patient_update",
              patientId,
              position,
              timestamp: new Date().toISOString(),
            })}\n\n`
            controller.enqueue(encoder.encode(data))
          } else if (hospitalId) {
            // Send hospital-wide queue updates
            const queueStatus = await getQueueStatus(Number.parseInt(hospitalId))
            const data = `data: ${JSON.stringify({
              type: "queue_update",
              hospitalId,
              queueStatus,
              timestamp: new Date().toISOString(),
            })}\n\n`
            controller.enqueue(encoder.encode(data))
          }
        } catch (error) {
          console.error("Error sending real-time update:", error)
        }
      }

      // Send initial update
      sendUpdate()

      // Set up interval for regular updates
      const interval = setInterval(sendUpdate, 5000) // Update every 5 seconds

      // Cleanup on close
      request.signal.addEventListener("abort", () => {
        clearInterval(interval)
        controller.close()
      })
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  })
}

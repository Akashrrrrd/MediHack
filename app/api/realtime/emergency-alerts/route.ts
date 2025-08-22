import type { NextRequest } from "next/server"
import { getEmergencyCases } from "@/lib/database"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hospitalId = searchParams.get("hospitalId")

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      const sendEmergencyUpdate = async () => {
        try {
          if (hospitalId) {
            const emergencyCases = await getEmergencyCases(Number.parseInt(hospitalId))
            const criticalCases = emergencyCases.filter((cas) => cas.priority === "critical")

            if (criticalCases.length > 0) {
              const data = `data: ${JSON.stringify({
                type: "emergency_alert",
                hospitalId,
                criticalCases,
                count: criticalCases.length,
                timestamp: new Date().toISOString(),
              })}\n\n`
              controller.enqueue(encoder.encode(data))
            }
          }
        } catch (error) {
          console.error("Error sending emergency alert:", error)
        }
      }

      // Check for emergencies every 2 seconds
      const interval = setInterval(sendEmergencyUpdate, 2000)

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
    },
  })
}

import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { WaitTimePredictor } from "@/lib/ai-predictor"
import { DatabaseService } from "@/lib/database"

// Helper function for realistic fallback wait times
function generateRealisticWaitTime(queueEntry: any, queueLength: number): number {
  const baseTime = 15 // Base consultation time
  const priorityMultipliers = { 1: 0.1, 2: 0.3, 3: 1.0, 4: 1.3 }
  const priorityMultiplier = priorityMultipliers[queueEntry.priority_level as keyof typeof priorityMultipliers] || 1.0

  // Calculate based on queue position and priority with more realistic timing
  const queuePosition = Math.max(1, queueLength - 2) // Account for patients ahead
  const estimatedTime = queuePosition * baseTime * priorityMultiplier + Math.random() * 8 + 5

  return Math.round(Math.max(5, Math.min(90, estimatedTime))) // Between 5-90 minutes (more realistic)
}

export async function POST(request: NextRequest) {
  try {
    const { queueEntryId, useAI = true } = await request.json()

    if (!queueEntryId) {
      return NextResponse.json({ error: "Queue entry ID is required" }, { status: 400 })
    }

    // Get queue entry and related data
    const queueEntry = await DatabaseService.getQueueEntry(queueEntryId)
    if (!queueEntry) {
      return NextResponse.json({ error: "Queue entry not found" }, { status: 404 })
    }

    const currentQueue = await DatabaseService.getQueueEntries(queueEntry.hospital_id, queueEntry.department_id)
    const availableDoctors = await DatabaseService.getDoctors(queueEntry.hospital_id, queueEntry.department_id)

    // Get basic AI prediction
    const basicPrediction = await WaitTimePredictor.predictWaitTime(queueEntry, currentQueue, availableDoctors)

    let enhancedPrediction = basicPrediction

    // Enhance with OpenAI if requested
    if (useAI && process.env.OPENAI_API_KEY) {
      try {
        const aiContext = `
Patient Information:
- Symptoms: ${queueEntry.symptoms}
- Priority Level: ${queueEntry.priority_level} (1=emergency, 2=urgent, 3=routine, 4=follow-up)
- Age: ${queueEntry.patient?.age || "Unknown"}

Current Hospital Situation:
- Queue Length: ${currentQueue.length} patients waiting
- Available Doctors: ${availableDoctors.length}
- Department: ${queueEntry.department?.name}
- Time of Day: ${new Date().toLocaleTimeString()}

Basic AI Prediction: ${basicPrediction.estimatedWaitTime} minutes

Based on this medical context, provide insights about:
1. Any factors that might affect wait time (complexity of symptoms, potential complications)
2. Recommendations for the patient while waiting
3. Confidence adjustment based on symptom complexity

Respond in JSON format with: { "timeAdjustment": number, "confidence": number, "patientAdvice": string, "reasoning": string }
`

        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: aiContext,
          system:
            "You are a medical AI assistant helping optimize hospital wait times. Provide practical, evidence-based insights while being empathetic to patient concerns.",
        })

        console.log("[v0] OpenAI response:", text)

        // Parse AI response
        try {
          const aiInsights = JSON.parse(text)
          enhancedPrediction = {
            ...basicPrediction,
            estimatedWaitTime: Math.max(5, basicPrediction.estimatedWaitTime + (aiInsights.timeAdjustment || 0)),
            confidence: Math.min(0.95, Math.max(0.3, aiInsights.confidence || basicPrediction.confidence)),
            factors: {
              ...basicPrediction.factors,
              aiInsights: {
                patientAdvice: aiInsights.patientAdvice,
                reasoning: aiInsights.reasoning,
              },
            },
          }
        } catch (parseError) {
          console.log("[v0] Failed to parse AI response, using basic prediction")
        }
      } catch (aiError) {
        console.log("[v0] OpenAI API error, falling back to basic prediction:", aiError)
        enhancedPrediction = {
          ...basicPrediction,
          estimatedWaitTime: Math.max(
            15,
            basicPrediction.estimatedWaitTime || generateRealisticWaitTime(queueEntry, currentQueue.length),
          ),
          confidence: Math.max(0.4, basicPrediction.confidence),
          factors: {
            ...basicPrediction.factors,
            fallbackReason: "OpenAI API unavailable - using enhanced local prediction",
          },
        }
      }
    }

    // Save prediction to database
    await DatabaseService.savePrediction({
      queue_entry_id: queueEntryId,
      predicted_wait_time: enhancedPrediction.estimatedWaitTime,
      confidence_score: enhancedPrediction.confidence,
      prediction_factors: enhancedPrediction.factors,
    })

    // Update queue entry with estimated wait time
    await DatabaseService.updateQueueEntry(queueEntryId, {
      estimated_wait_time: enhancedPrediction.estimatedWaitTime,
    })

    return NextResponse.json({
      success: true,
      prediction: enhancedPrediction,
    })
  } catch (error) {
    console.error("[v0] Prediction API error:", error)
    return NextResponse.json({ error: "Failed to generate prediction" }, { status: 500 })
  }
}

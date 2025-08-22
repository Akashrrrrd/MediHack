import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { WaitTimePredictor } from "@/lib/ai-predictor"
import { DatabaseService } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const { hospitalId, departmentId } = await request.json()

    // Get current queue and available doctors
    const queueEntries = await DatabaseService.getQueueEntries(hospitalId, departmentId)
    const availableDoctors = await DatabaseService.getDoctors(hospitalId, departmentId)

    if (queueEntries.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No patients in queue",
        allocation: [],
      })
    }

    // Get basic optimization
    const basicAllocation = WaitTimePredictor.optimizeAllocation(queueEntries, availableDoctors)

    // Enhance with OpenAI insights if API key is available
    let enhancedAllocation = basicAllocation

    if (process.env.OPENAI_API_KEY) {
      try {
        const allocationContext = `
Current Hospital Queue Analysis:
Total Patients Waiting: ${queueEntries.length}
Available Doctors: ${availableDoctors.length}

Patient Details:
${queueEntries
  .map(
    (entry) => `
- Patient: ${entry.patient?.name} (Priority: ${entry.priority_level})
  Symptoms: ${entry.symptoms}
  Wait Time: ${Math.floor((Date.now() - new Date(entry.arrival_time).getTime()) / 60000)} minutes
`,
  )
  .join("")}

Doctor Details:
${availableDoctors
  .map(
    (doctor) => `
- Dr. ${doctor.name} (${doctor.specialization})
  Avg Consultation: ${doctor.avg_consultation_time} minutes
  Department: ${doctor.department_id}
`,
  )
  .join("")}

Current Basic Allocation:
${basicAllocation
  .map(
    (alloc) => `
- Doctor ID ${alloc.doctorId}: ${alloc.patientIds.length} patients assigned
`,
  )
  .join("")}

Provide optimization recommendations considering:
1. Patient priority and symptom complexity
2. Doctor specialization match
3. Workload balancing
4. Emergency case handling

Respond with JSON: { "recommendations": [{"doctorId": number, "patientIds": number[], "reasoning": string}], "overallStrategy": string }
`

        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: allocationContext,
          system:
            "You are a medical operations AI optimizing patient flow in hospitals. Focus on patient safety, efficient resource utilization, and reducing wait times.",
        })

        console.log("[v0] OpenAI allocation response:", text)

        try {
          const aiRecommendations = JSON.parse(text)
          if (aiRecommendations.recommendations) {
            enhancedAllocation = aiRecommendations.recommendations.map((rec: any) => ({
              doctorId: rec.doctorId,
              patientIds: rec.patientIds,
              reasoning: rec.reasoning,
            }))
          }
        } catch (parseError) {
          console.log("[v0] Failed to parse AI allocation response, using basic allocation")
        }
      } catch (aiError) {
        console.log("[v0] OpenAI allocation error, using basic allocation:", aiError)
      }
    }

    return NextResponse.json({
      success: true,
      allocation: enhancedAllocation,
      totalPatients: queueEntries.length,
      availableDoctors: availableDoctors.length,
      optimizationTimestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Allocation optimization error:", error)
    return NextResponse.json({ error: "Failed to optimize allocation" }, { status: 500 })
  }
}

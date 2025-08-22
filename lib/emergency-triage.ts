export interface TriageScore {
  score: number // 1-10 scale (10 = most critical)
  category: "resuscitation" | "emergent" | "urgent" | "less-urgent" | "non-urgent"
  factors: {
    vitalSigns: number
    symptoms: number
    painLevel: number
    consciousness: number
    age: number
    waitTime: number
  }
  recommendations: string[]
  escalationRequired: boolean
}

export interface EmergencyProtocol {
  id: string
  name: string
  triggers: string[]
  actions: string[]
  timeLimit: number // minutes
  requiredPersonnel: string[]
}

export class EmergencyTriageSystem {
  private static readonly CRITICAL_SYMPTOMS = [
    "chest pain",
    "heart attack",
    "stroke",
    "severe bleeding",
    "unconscious",
    "difficulty breathing",
    "cardiac arrest",
    "severe trauma",
    "poisoning",
    "severe burns",
    "anaphylaxis",
    "seizure",
    "severe head injury",
  ]

  private static readonly HIGH_PRIORITY_SYMPTOMS = [
    "moderate bleeding",
    "broken bone",
    "severe pain",
    "high fever",
    "allergic reaction",
    "dehydration",
    "infection",
    "vomiting blood",
    "severe abdominal pain",
    "eye injury",
    "psychiatric emergency",
  ]

  private static readonly EMERGENCY_PROTOCOLS: EmergencyProtocol[] = [
    {
      id: "cardiac-arrest",
      name: "Cardiac Arrest Protocol",
      triggers: ["cardiac arrest", "no pulse", "cpr needed"],
      actions: ["Immediate CPR", "Call code blue", "Prepare defibrillator", "IV access", "Intubation if needed"],
      timeLimit: 2,
      requiredPersonnel: ["Emergency Physician", "Nurse", "Respiratory Therapist"],
    },
    {
      id: "stroke-alert",
      name: "Stroke Alert Protocol",
      triggers: ["stroke", "facial drooping", "speech difficulty", "weakness"],
      actions: ["Immediate CT scan", "Neurologist consult", "Blood work", "IV access", "Monitor vitals"],
      timeLimit: 15,
      requiredPersonnel: ["Emergency Physician", "Neurologist", "CT Technician"],
    },
    {
      id: "trauma-alert",
      name: "Trauma Alert Protocol",
      triggers: ["severe trauma", "multiple injuries", "motor vehicle accident"],
      actions: [
        "Trauma team activation",
        "X-rays and CT",
        "Blood type and cross-match",
        "IV access",
        "Surgery consult",
      ],
      timeLimit: 10,
      requiredPersonnel: ["Trauma Surgeon", "Emergency Physician", "Anesthesiologist"],
    },
  ]

  /**
   * Calculate comprehensive triage score for a patient
   */
  static calculateTriageScore(
    symptoms: string,
    age: number,
    vitalSigns?: {
      heartRate?: number
      bloodPressure?: { systolic: number; diastolic: number }
      temperature?: number
      oxygenSaturation?: number
    },
    painLevel?: number,
    consciousness?: "alert" | "confused" | "unconscious",
    waitTime?: number,
  ): TriageScore {
    let score = 0
    const factors = {
      vitalSigns: 0,
      symptoms: 0,
      painLevel: 0,
      consciousness: 0,
      age: 0,
      waitTime: 0,
    }

    const recommendations: string[] = []
    const lowerSymptoms = symptoms.toLowerCase()

    // Symptom scoring (0-4 points)
    if (this.CRITICAL_SYMPTOMS.some((symptom) => lowerSymptoms.includes(symptom))) {
      factors.symptoms = 4
      score += 4
      recommendations.push("Immediate medical attention required")
    } else if (this.HIGH_PRIORITY_SYMPTOMS.some((symptom) => lowerSymptoms.includes(symptom))) {
      factors.symptoms = 3
      score += 3
      recommendations.push("Urgent medical evaluation needed")
    } else if (lowerSymptoms.includes("pain") || lowerSymptoms.includes("fever")) {
      factors.symptoms = 2
      score += 2
    } else {
      factors.symptoms = 1
      score += 1
    }

    // Vital signs scoring (0-3 points)
    if (vitalSigns) {
      if (vitalSigns.heartRate) {
        if (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50) {
          factors.vitalSigns += 2
          score += 2
          recommendations.push("Abnormal heart rate detected")
        }
      }

      if (vitalSigns.bloodPressure) {
        const { systolic, diastolic } = vitalSigns.bloodPressure
        if (systolic > 180 || systolic < 90 || diastolic > 110 || diastolic < 60) {
          factors.vitalSigns += 2
          score += 2
          recommendations.push("Blood pressure abnormality")
        }
      }

      if (vitalSigns.oxygenSaturation && vitalSigns.oxygenSaturation < 95) {
        factors.vitalSigns += 3
        score += 3
        recommendations.push("Low oxygen saturation - oxygen therapy needed")
      }

      if (vitalSigns.temperature && (vitalSigns.temperature > 103 || vitalSigns.temperature < 95)) {
        factors.vitalSigns += 1
        score += 1
        recommendations.push("Temperature abnormality")
      }
    }

    // Pain level scoring (0-2 points)
    if (painLevel) {
      if (painLevel >= 8) {
        factors.painLevel = 2
        score += 2
        recommendations.push("Severe pain management required")
      } else if (painLevel >= 5) {
        factors.painLevel = 1
        score += 1
        recommendations.push("Pain management needed")
      }
    }

    // Consciousness scoring (0-3 points)
    if (consciousness) {
      switch (consciousness) {
        case "unconscious":
          factors.consciousness = 3
          score += 3
          recommendations.push("Altered consciousness - immediate evaluation")
          break
        case "confused":
          factors.consciousness = 2
          score += 2
          recommendations.push("Mental status changes noted")
          break
        case "alert":
          factors.consciousness = 0
          break
      }
    }

    // Age factor (0-1 points)
    if (age > 65 || age < 2) {
      factors.age = 1
      score += 1
      recommendations.push("Age-related priority consideration")
    }

    // Wait time escalation (0-2 points)
    if (waitTime) {
      if (waitTime > 120) {
        // 2 hours
        factors.waitTime = 2
        score += 2
        recommendations.push("Extended wait time - priority escalation")
      } else if (waitTime > 60) {
        // 1 hour
        factors.waitTime = 1
        score += 1
        recommendations.push("Monitor for condition changes")
      }
    }

    // Determine category based on score
    let category: TriageScore["category"]
    if (score >= 9) {
      category = "resuscitation"
    } else if (score >= 7) {
      category = "emergent"
    } else if (score >= 5) {
      category = "urgent"
    } else if (score >= 3) {
      category = "less-urgent"
    } else {
      category = "non-urgent"
    }

    const escalationRequired = score >= 7 || waitTime > 90

    return {
      score,
      category,
      factors,
      recommendations,
      escalationRequired,
    }
  }

  /**
   * Get applicable emergency protocols based on symptoms
   */
  static getApplicableProtocols(symptoms: string): EmergencyProtocol[] {
    const lowerSymptoms = symptoms.toLowerCase()
    return this.EMERGENCY_PROTOCOLS.filter((protocol) =>
      protocol.triggers.some((trigger) => lowerSymptoms.includes(trigger)),
    )
  }

  /**
   * Determine if immediate escalation is needed
   */
  static requiresImmediateEscalation(
    symptoms: string,
    waitTime: number,
    vitalSigns?: any,
  ): { required: boolean; reason: string; protocol?: EmergencyProtocol } {
    const lowerSymptoms = symptoms.toLowerCase()

    // Check for life-threatening symptoms
    const criticalSymptoms = ["cardiac arrest", "no pulse", "unconscious", "severe bleeding"]
    for (const symptom of criticalSymptoms) {
      if (lowerSymptoms.includes(symptom)) {
        const protocol = this.EMERGENCY_PROTOCOLS.find((p) =>
          p.triggers.some((trigger) => lowerSymptoms.includes(trigger)),
        )
        return {
          required: true,
          reason: `Critical symptom detected: ${symptom}`,
          protocol,
        }
      }
    }

    // Check for extended wait times with concerning symptoms
    if (waitTime > 60 && this.HIGH_PRIORITY_SYMPTOMS.some((symptom) => lowerSymptoms.includes(symptom))) {
      return {
        required: true,
        reason: `High-priority patient waiting over 1 hour: ${symptoms}`,
      }
    }

    // Check vital signs if available
    if (vitalSigns?.oxygenSaturation && vitalSigns.oxygenSaturation < 90) {
      return {
        required: true,
        reason: "Critical oxygen saturation level",
      }
    }

    return { required: false, reason: "" }
  }

  /**
   * Generate priority queue based on triage scores
   */
  static prioritizePatients(
    patients: Array<{
      id: number
      symptoms: string
      age: number
      arrivalTime: string
      vitalSigns?: any
      painLevel?: number
      consciousness?: "alert" | "confused" | "unconscious"
    }>,
  ): Array<{ patient: any; triageScore: TriageScore; queuePosition: number }> {
    const scoredPatients = patients.map((patient) => {
      const waitTime = Math.floor((Date.now() - new Date(patient.arrivalTime).getTime()) / 60000)
      const triageScore = this.calculateTriageScore(
        patient.symptoms,
        patient.age,
        patient.vitalSigns,
        patient.painLevel,
        patient.consciousness,
        waitTime,
      )

      return { patient, triageScore }
    })

    // Sort by triage score (highest first), then by arrival time for same scores
    scoredPatients.sort((a, b) => {
      if (a.triageScore.score !== b.triageScore.score) {
        return b.triageScore.score - a.triageScore.score
      }
      return new Date(a.patient.arrivalTime).getTime() - new Date(b.patient.arrivalTime).getTime()
    })

    return scoredPatients.map((item, index) => ({
      ...item,
      queuePosition: index + 1,
    }))
  }
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Heart, Brain, Zap, Thermometer, AlertTriangle, Phone, Clock, CheckCircle, XCircle, Info } from "lucide-react"
import { Header } from "@/components/header"

const emergencyConditions = [
  {
    id: "heart-attack",
    name: "Heart Attack",
    icon: Heart,
    severity: "critical",
    symptoms: ["Chest pain or pressure", "Shortness of breath", "Nausea", "Sweating", "Pain in arm/jaw"],
    dos: [
      "Call emergency services immediately (911/108)",
      "Chew aspirin if not allergic (325mg)",
      "Sit upright and stay calm",
      "Loosen tight clothing",
      "If unconscious, start CPR",
    ],
    donts: [
      "Don't drive yourself to hospital",
      "Don't eat or drink anything",
      "Don't take nitroglycerin unless prescribed",
      "Don't leave the person alone",
    ],
  },
  {
    id: "stroke",
    name: "Stroke",
    icon: Brain,
    severity: "critical",
    symptoms: ["Face drooping", "Arm weakness", "Speech difficulty", "Sudden confusion", "Severe headache"],
    dos: [
      "Call emergency services immediately",
      "Note the time symptoms started",
      "Keep person lying down with head elevated",
      "Remove dentures or food from mouth",
      "Stay with the person",
    ],
    donts: [
      "Don't give food or water",
      "Don't give medications",
      "Don't let them walk",
      "Don't wait to see if symptoms improve",
    ],
  },
  {
    id: "seizure",
    name: "Seizure",
    icon: Zap,
    severity: "urgent",
    symptoms: ["Uncontrolled shaking", "Loss of consciousness", "Confusion", "Staring spells", "Muscle stiffness"],
    dos: [
      "Clear area of dangerous objects",
      "Place something soft under head",
      "Turn person on their side",
      "Time the seizure duration",
      "Stay calm and reassure others",
    ],
    donts: [
      "Don't put anything in their mouth",
      "Don't hold them down",
      "Don't give water or food",
      "Don't leave them alone after seizure",
    ],
  },
  {
    id: "severe-bleeding",
    name: "Severe Bleeding",
    icon: AlertTriangle,
    severity: "critical",
    symptoms: ["Heavy blood loss", "Deep cuts", "Spurting blood", "Weakness", "Pale skin"],
    dos: [
      "Apply direct pressure with clean cloth",
      "Elevate the injured area if possible",
      "Call emergency services",
      "Apply pressure to pressure points",
      "Keep person warm and calm",
    ],
    donts: [
      "Don't remove embedded objects",
      "Don't use tourniquet unless trained",
      "Don't give food or water",
      "Don't move person unnecessarily",
    ],
  },
  {
    id: "high-fever",
    name: "High Fever (104°F+)",
    icon: Thermometer,
    severity: "urgent",
    symptoms: ["Temperature over 104°F", "Confusion", "Difficulty breathing", "Severe headache", "Rash"],
    dos: [
      "Remove excess clothing",
      "Apply cool, damp cloths to forehead",
      "Give fluids if conscious",
      "Monitor breathing and consciousness",
      "Seek immediate medical attention",
    ],
    donts: [
      "Don't use ice baths",
      "Don't give aspirin to children",
      "Don't bundle up in blankets",
      "Don't ignore other symptoms",
    ],
  },
  {
    id: "allergic-reaction",
    name: "Severe Allergic Reaction",
    icon: AlertTriangle,
    severity: "critical",
    symptoms: ["Difficulty breathing", "Swelling of face/throat", "Rapid pulse", "Dizziness", "Full body rash"],
    dos: [
      "Call emergency services immediately",
      "Use EpiPen if available",
      "Help person sit upright",
      "Remove or avoid allergen",
      "Monitor breathing closely",
    ],
    donts: [
      "Don't give oral medications if swallowing is difficult",
      "Don't leave person alone",
      "Don't assume symptoms will improve",
      "Don't give anything by mouth if unconscious",
    ],
  },
]

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "critical":
      return "destructive"
    case "urgent":
      return "secondary"
    default:
      return "default"
  }
}

const getSeverityIcon = (severity: string) => {
  switch (severity) {
    case "critical":
      return AlertTriangle
    case "urgent":
      return Clock
    default:
      return Info
  }
}

export default function EmergencyGuidePage() {
  const [selectedCondition, setSelectedCondition] = useState(emergencyConditions[0])

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="emergency-guide" />

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-serif font-bold text-foreground">Emergency Medical Guidance</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick reference guide for medical emergencies when immediate hospital care isn't available
          </p>

          <Alert className="max-w-2xl mx-auto">
            <Phone className="h-4 w-4" />
            <AlertDescription className="text-left">
              <strong>Always call emergency services first:</strong> 911 (US), 108 (India), or your local emergency
              number. This guide provides temporary assistance while waiting for professional help.
            </AlertDescription>
          </Alert>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Condition Selection */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Select Emergency Condition</CardTitle>
                <CardDescription>Choose the condition that best matches the symptoms</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {emergencyConditions.map((condition) => {
                  const IconComponent = condition.icon
                  const SeverityIcon = getSeverityIcon(condition.severity)

                  return (
                    <button
                      key={condition.id}
                      onClick={() => setSelectedCondition(condition)}
                      className={`w-full p-3 rounded-lg border text-left transition-colors ${
                        selectedCondition.id === condition.id
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <IconComponent className="w-5 h-5 text-primary" />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{condition.name}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={getSeverityColor(condition.severity)} className="text-xs">
                              <SeverityIcon className="w-3 h-3 mr-1" />
                              {condition.severity}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Detailed Guidance */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <selectedCondition.icon className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle className="font-serif">{selectedCondition.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getSeverityColor(selectedCondition.severity)}>
                        {selectedCondition.severity.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="symptoms" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="symptoms">Symptoms</TabsTrigger>
                    <TabsTrigger value="dos">What TO DO</TabsTrigger>
                    <TabsTrigger value="donts">What NOT to do</TabsTrigger>
                  </TabsList>

                  <TabsContent value="symptoms" className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Info className="w-4 h-4" />
                        Common Symptoms
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {selectedCondition.symptoms.map((symptom, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                            <div className="w-2 h-2 bg-primary rounded-full" />
                            <span className="text-sm">{symptom}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="dos" className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        What TO DO
                      </h3>
                      <div className="space-y-3">
                        {selectedCondition.dos.map((action, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800"
                          >
                            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-green-800 dark:text-green-200">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="donts" className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        What NOT to Do
                      </h3>
                      <div className="space-y-3">
                        {selectedCondition.donts.map((action, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800"
                          >
                            <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-red-800 dark:text-red-200">{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-800 dark:text-red-200">United States</h4>
                <p className="text-2xl font-bold text-red-600">911</p>
                <p className="text-sm text-red-700 dark:text-red-300">All emergencies</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-800 dark:text-red-200">India</h4>
                <p className="text-2xl font-bold text-red-600">108</p>
                <p className="text-sm text-red-700 dark:text-red-300">Medical emergencies</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-800 dark:text-blue-200">Poison Control</h4>
                <p className="text-2xl font-bold text-blue-600">1-800-222-1222</p>
                <p className="text-sm text-blue-700 dark:text-blue-300">US Poison Control</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

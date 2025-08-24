"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle, 
  Phone, 
  Heart, 
  Brain, 
  Thermometer, 
  Activity,
  Clock,
  MapPin,
  Zap,
  Shield,
  Stethoscope,
  Pill
} from "lucide-react"
import { Header } from "@/components/header"
import Link from "next/link"

export default function EmergencyGuidePage() {
  const emergencyConditions = [
    {
      icon: Heart,
      title: "Heart Attack",
      symptoms: ["Chest pain or pressure", "Pain in arm, neck, or jaw", "Shortness of breath", "Nausea", "Cold sweats"],
      action: "Call 911 immediately. Chew aspirin if not allergic.",
      severity: "critical"
    },
    {
      icon: Brain,
      title: "Stroke",
      symptoms: ["Sudden numbness or weakness", "Confusion or trouble speaking", "Severe headache", "Vision problems", "Loss of balance"],
      action: "Call 911 immediately. Note time symptoms started.",
      severity: "critical"
    },
    {
      icon: Activity,
      title: "Severe Allergic Reaction",
      symptoms: ["Difficulty breathing", "Swelling of face/throat", "Rapid pulse", "Dizziness", "Severe rash"],
      action: "Use EpiPen if available. Call 911 immediately.",
      severity: "critical"
    },
    {
      icon: Thermometer,
      title: "Severe Bleeding",
      symptoms: ["Heavy bleeding that won't stop", "Blood spurting from wound", "Weakness or dizziness", "Pale skin"],
      action: "Apply direct pressure. Elevate if possible. Call 911.",
      severity: "critical"
    },
    {
      icon: Stethoscope,
      title: "Difficulty Breathing",
      symptoms: ["Severe shortness of breath", "Wheezing or gasping", "Blue lips or fingernails", "Cannot speak in full sentences"],
      action: "Sit upright. Use inhaler if prescribed. Call 911.",
      severity: "urgent"
    },
    {
      icon: Pill,
      title: "Poisoning/Overdose",
      symptoms: ["Nausea and vomiting", "Confusion or drowsiness", "Difficulty breathing", "Seizures", "Unconsciousness"],
      action: "Call Poison Control: 1-800-222-1222. Do not induce vomiting unless told.",
      severity: "critical"
    }
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "destructive"
      case "urgent":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="emergency-guide" />

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
            Emergency Medical Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Recognize emergency symptoms and know when to seek immediate medical attention
          </p>
        </div>

        {/* Emergency Numbers */}
        <Alert className="border-red-200 bg-red-50">
          <Phone className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Emergency: 911</strong> | Poison Control: 1-800-222-1222 | Crisis Text Line: Text HOME to 741741
          </AlertDescription>
        </Alert>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-red-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Phone className="w-8 h-8 text-red-600 mx-auto mb-2" />
              <h3 className="font-semibold text-red-800">Call 911</h3>
              <p className="text-sm text-red-600">Life-threatening emergencies</p>
            </CardContent>
          </Card>
          <Card className="border-blue-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-800">Find Hospital</h3>
              <Link href="/patient">
                <Button variant="outline" size="sm" className="mt-2">
                  Locate Nearby
                </Button>
              </Link>
            </CardContent>
          </Card>
          <Card className="border-green-200 hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center">
              <Shield className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold text-green-800">First Aid</h3>
              <p className="text-sm text-green-600">Basic emergency care</p>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Conditions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            When to Seek Emergency Care
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {emergencyConditions.map((condition, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <condition.icon className="w-5 h-5 text-red-600" />
                      </div>
                      <CardTitle className="text-lg">{condition.title}</CardTitle>
                    </div>
                    <Badge variant={getSeverityColor(condition.severity)}>
                      {condition.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Symptoms:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {condition.symptoms.map((symptom, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                          {symptom}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Alert>
                    <Zap className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Action:</strong> {condition.action}
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* First Aid Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Basic First Aid Tips</CardTitle>
            <CardDescription>Essential knowledge for emergency situations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">For Bleeding:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Apply direct pressure with clean cloth</li>
                  <li>• Elevate the injured area above heart level</li>
                  <li>• Don't remove objects embedded in wounds</li>
                  <li>• Seek medical attention for severe bleeding</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">For Choking:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Encourage coughing if person can speak</li>
                  <li>• Perform Heimlich maneuver if unable to cough</li>
                  <li>• Call 911 if object doesn't dislodge</li>
                  <li>• Continue until help arrives</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">For Burns:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Cool burn with cold water for 10-20 minutes</li>
                  <li>• Don't use ice or butter</li>
                  <li>• Cover with sterile gauze</li>
                  <li>• Seek medical care for severe burns</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">For Seizures:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep person safe from injury</li>
                  <li>• Don't put anything in their mouth</li>
                  <li>• Time the seizure duration</li>
                  <li>• Call 911 if seizure lasts over 5 minutes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* When NOT to go to ER */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800">Consider Urgent Care Instead</CardTitle>
            <CardDescription className="text-blue-700">
              These conditions may not require emergency room care
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Urgent Care Conditions:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Minor cuts requiring stitches</li>
                  <li>• Sprains and minor fractures</li>
                  <li>• Mild to moderate fever</li>
                  <li>• Ear infections</li>
                  <li>• Minor burns</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Primary Care Conditions:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Routine check-ups</li>
                  <li>• Prescription refills</li>
                  <li>• Mild cold symptoms</li>
                  <li>• Chronic condition management</li>
                  <li>• Preventive care</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center space-y-4 py-8">
          <h3 className="text-xl font-semibold text-foreground">Need Medical Care Now?</h3>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/patient">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                <MapPin className="w-4 h-4 mr-2" />
                Find Nearby Hospital
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
              <Phone className="w-4 h-4 mr-2" />
              Call 911 for Emergencies
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Clock, Phone, Activity, Heart, Stethoscope, TrendingUp } from "lucide-react"
import { AIService } from "@/lib/ai-service"
import { EmergencyTriageForm } from "@/components/emergency-triage-form"

interface EmergencyManagementProps {
  hospitalId: number
}

interface EmergencyRecommendation {
  patientId: number
  patientName: string
  symptoms: string
  waitTime: number
  urgencyLevel: "critical" | "high" | "moderate"
  recommendation: string
}

interface EmergencyData {
  emergencyCases: any[]
  totalEmergencies: number
  recommendations: EmergencyRecommendation[]
}

interface TriageData {
  totalEmergencies: number
  criticalCount: number
  emergentCount: number
  escalations: any[]
  prioritizedPatients: any[]
}

export function EmergencyManagement({ hospitalId }: EmergencyManagementProps) {
  const [emergencyData, setEmergencyData] = useState<EmergencyData | null>(null)
  const [triageData, setTriageData] = useState<TriageData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [showTriageForm, setShowTriageForm] = useState(false)

  const fetchEmergencyData = async () => {
    setLoading(true)
    setError(null)

    try {
      const [emergencyResult, triageResult] = await Promise.all([
        AIService.getEmergencyRecommendations(hospitalId),
        fetch(`/api/emergency-triage?hospitalId=${hospitalId}`).then((res) => res.json()),
      ])

      if (emergencyResult) {
        setEmergencyData(emergencyResult)
      }

      if (triageResult.success) {
        setTriageData(triageResult)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmergencyData()
    // Refresh every 30 seconds for emergency cases
    const interval = setInterval(fetchEmergencyData, 30000)
    return () => clearInterval(interval)
  }, [hospitalId])

  const handleTriageComplete = (result: any) => {
    setShowTriageForm(false)
    setSelectedPatient(null)
    fetchEmergencyData() // Refresh data

    if (result.escalation?.required) {
      // Show escalation alert
      alert(`ESCALATION REQUIRED: ${result.escalation.reason}`)
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "resuscitation":
        return "destructive"
      case "emergent":
        return "destructive"
      case "urgent":
        return "secondary"
      case "less-urgent":
        return "outline"
      case "non-urgent":
        return "outline"
      default:
        return "outline"
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "resuscitation":
        return "RESUSCITATION"
      case "emergent":
        return "EMERGENT"
      case "urgent":
        return "URGENT"
      case "less-urgent":
        return "LESS URGENT"
      case "non-urgent":
        return "NON-URGENT"
      default:
        return "UNKNOWN"
    }
  }

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-serif flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-destructive" />
                Advanced Emergency Management
              </CardTitle>
              <CardDescription>AI-powered triage scoring and emergency prioritization system</CardDescription>
            </div>
            <Button onClick={fetchEmergencyData} disabled={loading} variant="outline" size="sm">
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {triageData && (
            <>
              {/* Enhanced Emergency Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{triageData.totalEmergencies}</div>
                  <div className="text-sm text-muted-foreground">Total Emergency Cases</div>
                </div>
                <div className="text-center p-4 bg-destructive/20 border border-destructive/30 rounded-lg">
                  <div className="text-2xl font-bold text-destructive">{triageData.criticalCount}</div>
                  <div className="text-sm text-muted-foreground">Critical/Resuscitation</div>
                </div>
                <div className="text-center p-4 bg-secondary/10 border border-secondary/20 rounded-lg">
                  <div className="text-2xl font-bold text-secondary">{triageData.emergentCount}</div>
                  <div className="text-sm text-muted-foreground">Emergent Cases</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-foreground">{triageData.escalations?.length || 0}</div>
                  <div className="text-sm text-muted-foreground">Escalations Required</div>
                </div>
              </div>

              {/* Escalation Alerts */}
              {triageData.escalations && triageData.escalations.length > 0 && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>IMMEDIATE ESCALATION REQUIRED:</strong> {triageData.escalations.length} patient(s) need
                    immediate attention.
                  </AlertDescription>
                </Alert>
              )}

              {triageData.totalEmergencies === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-primary/50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Active Emergency Cases</h3>
                  <p className="text-muted-foreground">All emergency cases have been handled. Great work!</p>
                </div>
              ) : (
                <>
                  {/* Prioritized Emergency Cases */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Triage-Prioritized Emergency Cases
                    </h3>
                    <div className="space-y-3">
                      {triageData.prioritizedPatients
                        .slice(0, 10) // Show top 10 priority cases
                        .map(({ patient, triageScore, queuePosition }: any, index: number) => (
                          <Card
                            key={patient.id}
                            className={`border-l-4 ${
                              triageScore.category === "resuscitation" || triageScore.category === "emergent"
                                ? "border-l-destructive bg-destructive/5"
                                : triageScore.category === "urgent"
                                  ? "border-l-secondary bg-secondary/5"
                                  : "border-l-muted"
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-3 flex-1">
                                  <div className="flex items-center gap-3 flex-wrap">
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        #{queuePosition}
                                      </Badge>
                                      <h4 className="font-medium text-foreground">Patient {patient.id}</h4>
                                    </div>
                                    <Badge variant={getCategoryColor(triageScore.category)}>
                                      {getCategoryLabel(triageScore.category)}
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                      <Activity className="w-3 h-3" />
                                      Score: {triageScore.score}/10
                                    </Badge>
                                  </div>

                                  <div className="space-y-2">
                                    <div className="text-sm text-muted-foreground">
                                      <strong>Symptoms:</strong> {patient.symptoms}
                                    </div>
                                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                                      <Clock className="w-4 h-4" />
                                      <strong>Wait Time:</strong>{" "}
                                      {Math.floor((Date.now() - new Date(patient.arrivalTime).getTime()) / 60000)}m
                                    </div>
                                  </div>

                                  {/* Triage Factors */}
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                                    <div className="bg-muted/50 p-2 rounded">
                                      <div className="font-medium">Symptoms</div>
                                      <div className="text-muted-foreground">{triageScore.factors.symptoms}/4</div>
                                    </div>
                                    <div className="bg-muted/50 p-2 rounded">
                                      <div className="font-medium">Vitals</div>
                                      <div className="text-muted-foreground">{triageScore.factors.vitalSigns}/3</div>
                                    </div>
                                    <div className="bg-muted/50 p-2 rounded">
                                      <div className="font-medium">Pain</div>
                                      <div className="text-muted-foreground">{triageScore.factors.painLevel}/2</div>
                                    </div>
                                  </div>

                                  {/* AI Recommendations */}
                                  {triageScore.recommendations.length > 0 && (
                                    <Alert className="mt-3">
                                      <Activity className="h-4 w-4" />
                                      <AlertDescription className="text-sm">
                                        <strong>Triage Recommendations:</strong>
                                        <ul className="mt-1 space-y-1">
                                          {triageScore.recommendations.slice(0, 2).map((rec: string, i: number) => (
                                            <li key={i}>• {rec}</li>
                                          ))}
                                        </ul>
                                      </AlertDescription>
                                    </Alert>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant={
                                      triageScore.category === "resuscitation" || triageScore.category === "emergent"
                                        ? "destructive"
                                        : "outline"
                                    }
                                    onClick={() => {
                                      setSelectedPatient(patient)
                                      setShowTriageForm(true)
                                    }}
                                  >
                                    <Stethoscope className="w-4 h-4 mr-1" />
                                    Triage
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Phone className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {!triageData && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p>Loading emergency triage data...</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Triage Form Modal */}
      {showTriageForm && selectedPatient && (
        <EmergencyTriageForm
          patientId={selectedPatient.id}
          patientName={`Patient ${selectedPatient.id}`}
          symptoms={selectedPatient.symptoms}
          onTriageComplete={handleTriageComplete}
          onCancel={() => {
            setShowTriageForm(false)
            setSelectedPatient(null)
          }}
        />
      )}
    </div>
  )
}

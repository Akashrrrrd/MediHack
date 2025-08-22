"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Heart, Activity, Clock, User } from "lucide-react"

interface EmergencyTriageFormProps {
  patientId: number
  patientName: string
  symptoms: string
  onTriageComplete: (result: any) => void
  onCancel: () => void
}

export function EmergencyTriageForm({
  patientId,
  patientName,
  symptoms,
  onTriageComplete,
  onCancel,
}: EmergencyTriageFormProps) {
  const [formData, setFormData] = useState({
    heartRate: "",
    systolicBP: "",
    diastolicBP: "",
    temperature: "",
    oxygenSaturation: "",
    painLevel: [5],
    consciousness: "alert" as "alert" | "confused" | "unconscious",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const vitalSigns = {
        heartRate: formData.heartRate ? Number.parseInt(formData.heartRate) : undefined,
        bloodPressure:
          formData.systolicBP && formData.diastolicBP
            ? {
                systolic: Number.parseInt(formData.systolicBP),
                diastolic: Number.parseInt(formData.diastolicBP),
              }
            : undefined,
        temperature: formData.temperature ? Number.parseFloat(formData.temperature) : undefined,
        oxygenSaturation: formData.oxygenSaturation ? Number.parseInt(formData.oxygenSaturation) : undefined,
      }

      const response = await fetch("/api/emergency-triage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          patientId,
          vitalSigns,
          painLevel: formData.painLevel[0],
          consciousness: formData.consciousness,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to process triage assessment")
      }

      const result = await response.json()
      onTriageComplete(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Triage assessment failed")
    } finally {
      setLoading(false)
    }
  }

  const getConsciousnessColor = (level: string) => {
    switch (level) {
      case "unconscious":
        return "destructive"
      case "confused":
        return "secondary"
      case "alert":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPainColor = (level: number) => {
    if (level >= 8) return "text-destructive"
    if (level >= 5) return "text-secondary"
    return "text-primary"
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <CardTitle className="text-xl font-serif">Emergency Triage Assessment</CardTitle>
              <CardDescription>Complete triage evaluation for {patientName}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Patient Info */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">Patient: {patientName}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <strong>Presenting Symptoms:</strong> {symptoms}
              </div>
            </div>

            {/* Vital Signs */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                Vital Signs
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="heartRate">Heart Rate (bpm)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="72"
                    value={formData.heartRate}
                    onChange={(e) => setFormData((prev) => ({ ...prev, heartRate: e.target.value }))}
                    min="30"
                    max="200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oxygenSat">Oxygen Saturation (%)</Label>
                  <Input
                    id="oxygenSat"
                    type="number"
                    placeholder="98"
                    value={formData.oxygenSaturation}
                    onChange={(e) => setFormData((prev) => ({ ...prev, oxygenSaturation: e.target.value }))}
                    min="70"
                    max="100"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systolicBP">Systolic BP (mmHg)</Label>
                  <Input
                    id="systolicBP"
                    type="number"
                    placeholder="120"
                    value={formData.systolicBP}
                    onChange={(e) => setFormData((prev) => ({ ...prev, systolicBP: e.target.value }))}
                    min="60"
                    max="250"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="diastolicBP">Diastolic BP (mmHg)</Label>
                  <Input
                    id="diastolicBP"
                    type="number"
                    placeholder="80"
                    value={formData.diastolicBP}
                    onChange={(e) => setFormData((prev) => ({ ...prev, diastolicBP: e.target.value }))}
                    min="40"
                    max="150"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="temperature">Temperature (°F)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={formData.temperature}
                    onChange={(e) => setFormData((prev) => ({ ...prev, temperature: e.target.value }))}
                    min="90"
                    max="110"
                  />
                </div>
              </div>
            </div>

            {/* Pain Assessment */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Pain Assessment
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Pain Level (0-10 scale)</Label>
                  <Badge variant="outline" className={getPainColor(formData.painLevel[0])}>
                    {formData.painLevel[0]}/10
                  </Badge>
                </div>
                <Slider
                  value={formData.painLevel}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, painLevel: value }))}
                  max={10}
                  min={0}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>No Pain</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>

            {/* Consciousness Level */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Mental Status
              </h3>

              <div className="space-y-2">
                <Label htmlFor="consciousness">Level of Consciousness</Label>
                <Select
                  value={formData.consciousness}
                  onValueChange={(value: "alert" | "confused" | "unconscious") =>
                    setFormData((prev) => ({ ...prev, consciousness: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alert">
                      <div className="flex items-center gap-2">
                        <Badge variant={getConsciousnessColor("alert")}>Alert</Badge>
                        <span>Awake and responsive</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="confused">
                      <div className="flex items-center gap-2">
                        <Badge variant={getConsciousnessColor("confused")}>Confused</Badge>
                        <span>Disoriented or altered mental state</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="unconscious">
                      <div className="flex items-center gap-2">
                        <Badge variant={getConsciousnessColor("unconscious")}>Unconscious</Badge>
                        <span>Unresponsive</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
                {loading ? "Processing..." : "Complete Triage"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

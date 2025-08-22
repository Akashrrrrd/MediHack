"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, User, Phone, Calendar, AlertTriangle } from "lucide-react"
import { AIService } from "@/lib/ai-service"

interface PatientRegistrationFormProps {
  hospitalId?: number // Added hospitalId prop to support dynamic hospital selection
  onSuccess: (result: any) => void
  onCancel: () => void
}

export function PatientRegistrationForm({ hospitalId = 1, onSuccess, onCancel }: PatientRegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    age: "",
    symptoms: "",
    priority_level: 3 as 1 | 2 | 3 | 4,
    department_id: 1,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const departments = [
    { id: 1, name: "Emergency Department", type: "emergency" },
    { id: 2, name: "General Medicine", type: "opd" },
    { id: 3, name: "Cardiology", type: "specialist" },
    { id: 4, name: "Pediatrics", type: "opd" },
  ]

  const priorityLevels = [
    { value: 1, label: "Emergency", description: "Life-threatening condition" },
    { value: 2, label: "Urgent", description: "Serious condition requiring prompt attention" },
    { value: 3, label: "Routine", description: "Standard medical consultation" },
    { value: 4, label: "Follow-up", description: "Scheduled follow-up appointment" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await AIService.addPatientWithPrediction({
        ...formData,
        age: formData.age ? Number.parseInt(formData.age) : undefined,
        hospital_id: hospitalId, // Use dynamic hospitalId instead of hardcoded 1
      })

      if (result) {
        onSuccess(result)
      } else {
        setError("Failed to register. Please try again.")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <CardTitle className="text-2xl font-serif">Patient Registration</CardTitle>
              <CardDescription>
                Please provide your information to join the queue and receive wait time estimates
              </CardDescription>
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

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      placeholder="+1-555-0123"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="age"
                      type="number"
                      placeholder="25"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      className="pl-10"
                      min="0"
                      max="120"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department_id.toString()}
                    onValueChange={(value) => handleInputChange("department_id", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Medical Information</h3>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Symptoms / Reason for Visit *</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Please describe your symptoms or reason for the visit..."
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange("symptoms", e.target.value)}
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level *</Label>
                <Select
                  value={formData.priority_level.toString()}
                  onValueChange={(value) =>
                    handleInputChange("priority_level", Number.parseInt(value) as 1 | 2 | 3 | 4)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value.toString()}>
                        <div className="space-y-1">
                          <div className="font-medium">{priority.label}</div>
                          <div className="text-sm text-muted-foreground">{priority.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Emergency Notice */}
            {formData.priority_level === 1 && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Emergency Priority Selected:</strong> If this is a life-threatening emergency, please call 911
                  or go directly to the emergency department immediately.
                </AlertDescription>
              </Alert>
            )}

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading || !formData.name || !formData.symptoms}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                {loading ? "Registering..." : "Join Queue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

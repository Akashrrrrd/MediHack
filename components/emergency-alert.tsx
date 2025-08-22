"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AlertTriangle, Phone, MapPin, Clock } from "lucide-react"

export function EmergencyAlert() {
  const [isOpen, setIsOpen] = useState(false)

  const emergencyContacts = [
    { label: "Emergency Services", number: "911", description: "Life-threatening emergencies" },
    { label: "Hospital Emergency", number: "+1-555-0123", description: "Direct emergency department" },
    { label: "Poison Control", number: "1-800-222-1222", description: "Poisoning emergencies" },
    { label: "Mental Health Crisis", number: "988", description: "Suicide & crisis lifeline" },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm" className="gap-2">
          <AlertTriangle className="w-4 h-4" />
          Emergency
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Emergency Assistance
          </DialogTitle>
          <DialogDescription>
            If you are experiencing a medical emergency, please contact emergency services immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Life-threatening emergency?</strong> Call 911 immediately or go to the nearest emergency room.
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Emergency Contacts</h4>
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium text-foreground">{contact.label}</div>
                  <div className="text-sm text-muted-foreground">{contact.description}</div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(`tel:${contact.number}`)}
                  className="gap-1"
                >
                  <Phone className="w-3 h-3" />
                  {contact.number}
                </Button>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground">Hospital Information</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>123 Healthcare Ave, Medical District</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Emergency Department: 24/7</span>
              </div>
            </div>
          </div>

          <Button onClick={() => setIsOpen(false)} className="w-full" variant="outline">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

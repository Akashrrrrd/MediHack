"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Users, Clock } from "lucide-react"

interface Hospital {
  id: number
  name: string
  address: string
  phone: string
  departments: Array<{
    name: string
    type: string
    capacity: number
    current_patients: number
    avg_wait_time: number
  }>
}

export function HospitalSelector({ onSelect }: { onSelect: (hospitalId: number) => void }) {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const mockHospitals: Hospital[] = [
      {
        id: 1,
        name: "City General Hospital",
        address: "123 Healthcare Ave, Medical District",
        phone: "+1-555-0123",
        departments: [
          { name: "Emergency", type: "emergency", capacity: 30, current_patients: 8, avg_wait_time: 45 },
          { name: "General Medicine", type: "opd", capacity: 50, current_patients: 12, avg_wait_time: 25 },
        ],
      },
      {
        id: 2,
        name: "Metro Emergency Center",
        address: "456 Urgent Care Blvd, Downtown",
        phone: "+1-555-0456",
        departments: [
          { name: "Emergency", type: "emergency", capacity: 40, current_patients: 15, avg_wait_time: 60 },
          { name: "Urgent Care", type: "opd", capacity: 35, current_patients: 8, avg_wait_time: 20 },
        ],
      },
      {
        id: 3,
        name: "St. Mary's Medical Center",
        address: "789 Healing Way, Northside",
        phone: "+1-555-0789",
        departments: [
          { name: "Emergency", type: "emergency", capacity: 45, current_patients: 6, avg_wait_time: 30 },
          { name: "Surgery", type: "specialist", capacity: 15, current_patients: 3, avg_wait_time: 90 },
        ],
      },
      {
        id: 4,
        name: "Children's Hospital of Hope",
        address: "321 Pediatric Plaza, Westend",
        phone: "+1-555-0321",
        departments: [
          { name: "Pediatric Emergency", type: "emergency", capacity: 30, current_patients: 4, avg_wait_time: 35 },
          { name: "NICU", type: "specialist", capacity: 18, current_patients: 12, avg_wait_time: 15 },
        ],
      },
      {
        id: 5,
        name: "Regional Trauma Center",
        address: "654 Emergency Blvd, Southgate",
        phone: "+1-555-0654",
        departments: [
          { name: "Trauma Emergency", type: "emergency", capacity: 60, current_patients: 22, avg_wait_time: 40 },
          { name: "Critical Care", type: "specialist", capacity: 35, current_patients: 28, avg_wait_time: 120 },
        ],
      },
    ]

    setHospitals(mockHospitals)
    setLoading(false)
  }, [])

  const getWaitTimeColor = (waitTime: number) => {
    if (waitTime <= 30) return "bg-green-100 text-green-800"
    if (waitTime <= 60) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getCapacityColor = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100
    if (percentage <= 50) return "text-green-600"
    if (percentage <= 80) return "text-yellow-600"
    return "text-red-600"
  }

  if (loading) {
    return <div className="text-center py-8">Loading hospitals...</div>
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Hospital</h2>
        <p className="text-gray-600">Select a hospital to view current wait times and book your appointment</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {hospitals.map((hospital) => (
          <Card key={hospital.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{hospital.name}</CardTitle>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {hospital.address}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-1" />
                {hospital.phone}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {hospital.departments.map((dept, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">{dept.name}</div>
                    <div className="flex items-center text-xs text-gray-600">
                      <Users className="h-3 w-3 mr-1" />
                      <span className={getCapacityColor(dept.current_patients, dept.capacity)}>
                        {dept.current_patients}/{dept.capacity}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${getWaitTimeColor(dept.avg_wait_time)} text-xs`}>
                      <Clock className="h-3 w-3 mr-1" />
                      {dept.avg_wait_time}m
                    </Badge>
                  </div>
                </div>
              ))}

              <Button onClick={() => onSelect(hospital.id)} className="w-full mt-4">
                Select Hospital
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Navigation, Phone, Clock } from "lucide-react"
import { getUserLocation, getNearbyHospitals, type HospitalWithDistance } from "@/lib/location-service"

interface LocationHospitalFinderProps {
  onHospitalSelect: (hospitalId: number, hospitalData: HospitalWithDistance) => void
}

export default function LocationHospitalFinder({ onHospitalSelect }: LocationHospitalFinderProps) {
  const [nearbyHospitals, setNearbyHospitals] = useState<HospitalWithDistance[]>([])
  const [loading, setLoading] = useState(false)
  const [locationEnabled, setLocationEnabled] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const findNearbyHospitals = async () => {
    setLoading(true)
    setError(null)

    try {
      const userLocation = await getUserLocation()
      const hospitals = await getNearbyHospitals(userLocation)
      setNearbyHospitals(hospitals)
      setLocationEnabled(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get location")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {!locationEnabled ? (
        <Card className="border-primary/20">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="font-serif">Find Hospitals Near You</CardTitle>
            <CardDescription>
              Allow location access to discover nearby hospitals with real-time wait times
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={findNearbyHospitals} disabled={loading} className="gap-2">
              <Navigation className="w-4 h-4" />
              {loading ? "Finding Hospitals..." : "Enable Location & Find Hospitals"}
            </Button>
            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Hospitals Near You</h3>
            <Button variant="outline" size="sm" onClick={findNearbyHospitals}>
              <Navigation className="w-4 h-4 mr-2" />
              Refresh Location
            </Button>
          </div>

          <div className="grid gap-4">
            {nearbyHospitals.map((hospital) => (
              <Card
                key={hospital.id}
                className="cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => onHospitalSelect(hospital.id, hospital)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{hospital.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        {hospital.address}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        {hospital.phone}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="text-sm font-medium text-primary">{hospital.distance.toFixed(1)} km away</div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />~{Math.ceil(hospital.distance * 3)} min drive
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, MapPin } from "lucide-react"

interface SuccessNotificationProps {
  show: boolean
  onClose: () => void
  patientName: string
  hospitalName: string
  estimatedWaitTime: number
  queuePosition: number
  department: string
}

export function SuccessNotification({
  show,
  onClose,
  patientName,
  hospitalName,
  estimatedWaitTime,
  queuePosition,
  department
}: SuccessNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for fade out animation
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const formatWaitTime = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <div className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <Card className="border-green-200 bg-green-50 shadow-lg max-w-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="space-y-2 flex-1">
              <div>
                <h4 className="font-semibold text-green-800">Successfully Joined Queue!</h4>
                <p className="text-sm text-green-700">Welcome, {patientName}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <MapPin className="w-3 h-3" />
                  <span>{hospitalName}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700">
                  <Users className="w-3 h-3" />
                  <span>{department}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant="outline" className="text-xs bg-white border-green-300 text-green-700">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatWaitTime(estimatedWaitTime)}
                </Badge>
                <Badge variant="outline" className="text-xs bg-white border-green-300 text-green-700">
                  Position #{queuePosition}
                </Badge>
              </div>

              <p className="text-xs text-green-600">
                You'll receive real-time updates on your wait time
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
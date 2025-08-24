"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Zap, Users, AlertTriangle, BarChart3 } from "lucide-react"

interface DemoControlsProps {
  onScenarioChange: (scenario: string) => void
  currentScenario?: string
}

export function DemoControls({ onScenarioChange, currentScenario }: DemoControlsProps) {
  const [isRunning, setIsRunning] = useState(false)

  const scenarios = [
    {
      id: "normal",
      name: "Normal Operations",
      description: "Standard hospital day with routine patients",
      icon: Users,
      color: "bg-blue-500",
      stats: { patients: 12, emergency: 1, avgWait: 25 }
    },
    {
      id: "emergency",
      name: "Emergency Rush",
      description: "Multiple critical cases requiring immediate attention",
      icon: AlertTriangle,
      color: "bg-red-500",
      stats: { patients: 25, emergency: 5, avgWait: 45 }
    },
    {
      id: "optimization",
      name: "AI Optimization",
      description: "Demonstrate AI-powered queue management",
      icon: Zap,
      color: "bg-purple-500",
      stats: { patients: 18, emergency: 2, avgWait: 20 }
    },
    {
      id: "analytics",
      name: "Analytics Demo",
      description: "Show comprehensive hospital analytics",
      icon: BarChart3,
      color: "bg-green-500",
      stats: { patients: 15, emergency: 1, avgWait: 30 }
    }
  ]

  const runScenario = (scenarioId: string) => {
    setIsRunning(true)
    onScenarioChange(scenarioId)
    
    // Simulate scenario execution
    setTimeout(() => {
      setIsRunning(false)
    }, 2000)
  }

  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PUBLIC_DEMO_MODE) {
    return null
  }

  return (
    <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
      <CardHeader>
        <CardTitle className="text-lg font-serif flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          Hackathon Demo Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {scenarios.map((scenario) => {
            const Icon = scenario.icon
            const isActive = currentScenario === scenario.id
            
            return (
              <div
                key={scenario.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  isActive 
                    ? 'border-primary bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => runScenario(scenario.id)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-full ${scenario.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-sm font-medium">{scenario.name}</div>
                </div>
                <div className="text-xs text-muted-foreground mb-2">
                  {scenario.description}
                </div>
                <div className="flex gap-1 flex-wrap">
                  <Badge variant="outline" className="text-xs">
                    {scenario.stats.patients}p
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {scenario.stats.emergency}e
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {scenario.stats.avgWait}m
                  </Badge>
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">
            🎯 <strong>Hackathon Mode:</strong> Click scenarios to demonstrate AI capabilities
          </div>
          <Badge variant="secondary" className="text-xs">
            {isRunning ? "Running..." : "Ready"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}
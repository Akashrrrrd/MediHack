"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Clock, TrendingUp, ArrowRight, Activity, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { Header } from "@/components/header"

export default function HomePage() {
  const features = [
    {
      icon: Clock,
      title: "Real-time AI Predictions",
      description:
        "Advanced machine learning algorithms analyze patient symptoms, queue dynamics, and doctor availability for accurate wait time estimates",
    },
    {
      icon: Activity,
      title: "Smart Emergency Triage",
      description:
        "AI-powered severity assessment using vital signs and symptom analysis with automatic priority escalation for critical cases",
    },
    {
      icon: TrendingUp,
      title: "Intelligent Load Optimization",
      description:
        "Dynamic doctor-patient allocation and resource management for maximum hospital efficiency and reduced bottlenecks",
    },
    {
      icon: Shield,
      title: "Advanced Patient Safety",
      description:
        "Continuous monitoring, emergency alerts, and predictive analytics to ensure optimal patient outcomes and safety",
    },
  ]

  const stats = [
    { label: "Average Wait Reduction", value: "40%", icon: TrendingUp },
    { label: "Patient Satisfaction", value: "95%", icon: Heart },
    { label: "Emergency Response", value: "<5min", icon: Zap },
    { label: "Hospitals Connected", value: "5+", icon: Users },
  ]

  const aiFeatures = [
    "🤖 OpenAI GPT-4 Integration",
    "📊 Real-time Analytics Dashboard",
    "🚨 Emergency Auto-Detection",
    "⚡ Live Queue Optimization",
    "🏥 Multi-Hospital Support",
    "📱 Real-time Notifications",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage="home" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-6xl mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight">
                AI-Powered Hospital
                <br />
                <span className="text-primary">Wait-Time Optimizer</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your hospital experience with intelligent wait time predictions, emergency prioritization, and
                real-time queue optimization powered by <strong>OpenAI GPT-4</strong> and advanced machine learning.
              </p>
            </div>

            <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6 max-w-4xl mx-auto">
              <h3 className="text-lg font-semibold text-foreground mb-4">🚀 AI-Powered Features</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-muted-foreground">
                {aiFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/patient">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 px-8 py-3">
                  🏥 Find Nearby Hospitals
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/admin">
                <Button size="lg" variant="outline" className="gap-2 bg-transparent px-8 py-3">
                  👨‍⚕️ Admin Dashboard
                  <Users className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <stat.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Intelligent Healthcare Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered system combines predictive analytics with real-time data to optimize hospital operations
              and improve patient outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/20 transition-colors">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="font-serif">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary/5">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
              Ready to Transform Healthcare?
            </h2>
            <p className="text-lg text-muted-foreground">
              Experience the future of healthcare with our AI-powered system. Designed for hospitals, ready for
              production deployment with comprehensive real-time capabilities and location-based services.
            </p>

            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full">✅ Production Ready</div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">🤖 AI Integrated</div>
              <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full">⚡ Real-time Updates</div>
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full">📍 Location-Based</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/patient">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                🚀 Start Patient Journey
              </Button>
            </Link>
            <Link href="/admin">
              <Button size="lg" variant="outline">
                📊 Explore Analytics
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Heart className="w-6 h-6 text-primary" />
              <span className="text-xl font-serif font-bold text-foreground">MediHack</span>
            </div>
            <p className="text-muted-foreground">
              AI-Powered Hospital Wait-Time Optimizer - Revolutionizing Healthcare Experience
            </p>
            <div className="text-sm text-muted-foreground space-y-2">
              <div>Built with Next.js, OpenAI GPT-4, and Real-time Analytics</div>
              <div>© 2024 MediHack. Built with AI for better healthcare outcomes.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

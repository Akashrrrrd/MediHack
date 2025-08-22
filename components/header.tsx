"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, Menu, X, Activity, Users, BarChart3, AlertTriangle, FileText } from "lucide-react"
import { useSession } from "@/hooks/use-session"

interface HeaderProps {
  currentPage?: "home" | "patient" | "admin" | "emergency-guide" | "records"
}

export function Header({ currentPage = "home" }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { session } = useSession()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-healthcare-primary rounded-lg p-2">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">MediHack</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === "home"
                  ? "bg-healthcare-primary text-white"
                  : "text-gray-700 hover:text-healthcare-primary hover:bg-gray-50"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link
              href="/patient"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === "patient"
                  ? "bg-healthcare-primary text-white"
                  : "text-gray-700 hover:text-healthcare-primary hover:bg-gray-50"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>Patient Portal</span>
            </Link>

            {session && (
              <Link
                href="/patient/records"
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentPage === "records"
                    ? "bg-healthcare-primary text-white"
                    : "text-gray-700 hover:text-healthcare-primary hover:bg-gray-50"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>Patient Records</span>
              </Link>
            )}

            <Link
              href="/emergency-guide"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === "emergency-guide"
                  ? "bg-red-600 text-white"
                  : "text-red-600 hover:text-red-700 hover:bg-red-50"
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Emergency Guide</span>
            </Link>

            <Link
              href="/admin"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                currentPage === "admin"
                  ? "bg-healthcare-primary text-white"
                  : "text-gray-700 hover:text-healthcare-primary hover:bg-gray-50"
              }`}
            >
              <BarChart3 className="h-4 w-4" />
              <span>Hospital Analytics</span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <Link
                href="/"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === "home"
                    ? "bg-healthcare-primary text-white"
                    : "text-gray-700 hover:text-healthcare-primary hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Activity className="h-5 w-5" />
                <span>Home</span>
              </Link>
              <Link
                href="/patient"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === "patient"
                    ? "bg-healthcare-primary text-white"
                    : "text-gray-700 hover:text-healthcare-primary hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <Users className="h-5 w-5" />
                <span>Patient Portal</span>
              </Link>

              {session && (
                <Link
                  href="/patient/records"
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                    currentPage === "records"
                      ? "bg-healthcare-primary text-white"
                      : "text-gray-700 hover:text-healthcare-primary hover:bg-gray-50"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <FileText className="h-5 w-5" />
                  <span>Patient Records</span>
                </Link>
              )}

              <Link
                href="/emergency-guide"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === "emergency-guide"
                    ? "bg-red-600 text-white"
                    : "text-red-600 hover:text-red-700 hover:bg-red-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <AlertTriangle className="h-5 w-5" />
                <span>Emergency Guide</span>
              </Link>

              <Link
                href="/admin"
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                  currentPage === "admin"
                    ? "bg-healthcare-primary text-white"
                    : "text-gray-700 hover:text-healthcare-primary hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                <span>Hospital Analytics</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export interface UserSession {
  hospitalId: string
  hospitalName: string
  hospitalAddress: string
  hospitalPhone: string
  patientId?: string
  queuePosition?: number
  waitTime?: number
  location?: {
    latitude: number
    longitude: number
  }
  lastUpdated: string
}

export class SessionStorage {
  private static readonly SESSION_KEY = "medi_hack_session"

  static saveSession(session: Partial<UserSession>): void {
    try {
      const existing = this.getSession()
      const updated = { ...existing, ...session, lastUpdated: new Date().toISOString() }
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error("Failed to save session:", error)
    }
  }

  static getSession(): UserSession | null {
    try {
      const stored = localStorage.getItem(this.SESSION_KEY)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.error("Failed to get session:", error)
      return null
    }
  }

  static clearSession(): void {
    try {
      localStorage.removeItem(this.SESSION_KEY)
    } catch (error) {
      console.error("Failed to clear session:", error)
    }
  }

  static hasValidSession(): boolean {
    const session = this.getSession()
    if (!session) return false

    // Check if session is less than 24 hours old
    const lastUpdated = new Date(session.lastUpdated)
    const now = new Date()
    const hoursDiff = (now.getTime() - lastUpdated.getTime()) / (1000 * 60 * 60)

    return hoursDiff < 24 && !!session.hospitalId
  }
}

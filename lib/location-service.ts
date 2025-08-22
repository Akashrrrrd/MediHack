export interface Location {
  latitude: number
  longitude: number
}

export interface HospitalWithDistance {
  id: number
  name: string
  address: string
  phone: string
  latitude: number
  longitude: number
  distance: number
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function getUserLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(new Error(`Location access denied: ${error.message}`))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}

export async function getNearbyHospitals(userLocation: Location): Promise<HospitalWithDistance[]> {
  try {
    const response = await fetch(
      `/api/hospitals?lat=${userLocation.latitude}&lon=${userLocation.longitude}&radius=15000`,
    )
    const hospitals = await response.json()

    return hospitals
      .map((hospital: any) => ({
        ...hospital,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          hospital.latitude,
          hospital.longitude,
        ),
      }))
      .sort((a: HospitalWithDistance, b: HospitalWithDistance) => a.distance - b.distance)
  } catch (error) {
    console.error("Error fetching nearby hospitals:", error)
    return []
  }
}

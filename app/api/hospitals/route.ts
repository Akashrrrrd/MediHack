import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get("lat")
  const lon = searchParams.get("lon")
  const radius = searchParams.get("radius") || "10000" // 10km default

  // If no coordinates provided, return mock data for development
  if (!lat || !lon) {
    const mockHospitals = [
      {
        id: 1,
        name: "City General Hospital",
        address: "123 Main Street, Downtown",
        phone: "(555) 123-4567",
        latitude: 40.7128,
        longitude: -74.006,
      },
      {
        id: 2,
        name: "Metro Emergency Center",
        address: "456 Oak Avenue, Midtown",
        phone: "(555) 987-6543",
        latitude: 40.7589,
        longitude: -73.9851,
      },
    ]
    return NextResponse.json(mockHospitals)
  }

  try {
    const overpassQuery = `
      [out:json][timeout:25];
      (
        node["amenity"="hospital"](around:${radius},${lat},${lon});
        way["amenity"="hospital"](around:${radius},${lat},${lon});
        relation["amenity"="hospital"](around:${radius},${lat},${lon});
      );
      out center meta;
    `

    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${encodeURIComponent(overpassQuery)}`,
    })

    if (!response.ok) {
      throw new Error("Failed to fetch from Overpass API")
    }

    const data = await response.json()

    const hospitals = data.elements
      .filter((element: any) => element.tags?.name) // Only include hospitals with names
      .slice(0, 20) // Limit to 20 hospitals
      .map((element: any, index: number) => {
        const lat = element.lat || element.center?.lat
        const lon = element.lon || element.center?.lon

        return {
          id: element.id || index + 1000, // Use OSM ID or generate one
          name: element.tags.name,
          address: [
            element.tags["addr:street"] && element.tags["addr:housenumber"]
              ? `${element.tags["addr:housenumber"]} ${element.tags["addr:street"]}`
              : element.tags["addr:full"] || "Address not available",
            element.tags["addr:city"] || element.tags["addr:suburb"] || "",
            element.tags["addr:state"] || element.tags["addr:country"] || "",
          ]
            .filter(Boolean)
            .join(", "),
          phone: element.tags.phone || element.tags["contact:phone"] || "Phone not available",
          latitude: lat,
          longitude: lon,
          website: element.tags.website || element.tags["contact:website"] || null,
          emergency: element.tags.emergency === "yes" || element.tags["healthcare:speciality"]?.includes("emergency"),
        }
      })
      .filter((hospital: any) => hospital.latitude && hospital.longitude) // Only include hospitals with valid coordinates

    return NextResponse.json(hospitals)
  } catch (error) {
    console.error("Error fetching hospitals:", error)

    const fallbackHospitals = [
      {
        id: 1,
        name: "Local Hospital (API Error)",
        address: "Location services temporarily unavailable",
        phone: "Contact local directory",
        latitude: Number.parseFloat(lat),
        longitude: Number.parseFloat(lon),
      },
    ]

    return NextResponse.json(fallbackHospitals)
  }
}

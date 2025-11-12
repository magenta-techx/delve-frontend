import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const { latitude, longitude } = await request.json()

  const apiKey = process.env["GOOGLE_MAPS_API_KEY"]

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
  }

  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return NextResponse.json({ error: "Latitude and longitude are required" }, { status: 400 })
  }

  try {
    const params = new URLSearchParams({
      latlng: `${latitude},${longitude}`,
      key: apiKey,
      language: "en",
    })

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`Google API error: ${response.status}`)
    }

    const data = await response.json()
    const firstResult = data.results?.[0]
    const formattedAddress = firstResult?.formatted_address ?? null
    const addressComponents = firstResult?.address_components ?? []

    const stateComponent = addressComponents.find((component: { types?: string[] }) =>
      Array.isArray(component.types) && component.types.includes("administrative_area_level_1")
    )

    return NextResponse.json({
      address: formattedAddress,
      state: stateComponent?.long_name ?? null,
    })
  } catch (error) {
    console.error("Reverse geocode error:", error)
    return NextResponse.json({ error: "Failed to reverse geocode location" }, { status: 500 })
  }
}

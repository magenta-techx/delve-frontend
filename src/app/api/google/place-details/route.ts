import { type NextRequest, NextResponse } from "next/server"

interface PlaceDetailsRequestBody {
  placeId?: string
  sessionToken?: string
}

export async function POST(request: NextRequest) {
  const { placeId, sessionToken }: PlaceDetailsRequestBody = await request.json()

  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 })
  }

  const apiKey = process.env["GOOGLE_MAPS_API_KEY"]

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
  }

  try {
  const normalizedPlaceId = placeId.startsWith("places/") ? placeId.replace(/^places\//, "") : placeId
  const url = new URL(`https://places.googleapis.com/v1/places/${normalizedPlaceId}`)

    url.searchParams.set("languageCode", "en")
    url.searchParams.set("regionCode", "NG")

    if (sessionToken) {
      url.searchParams.set("sessionToken", sessionToken)
    }

    const fieldMask = [
      "id",
      "displayName.text",
      "formattedAddress",
      "shortFormattedAddress",
      "location.latitude",
      "location.longitude",
      "addressComponents.longText",
      "addressComponents.shortText",
      "addressComponents.types",
      "googleMapsUri",
    ].join(",")

    const detailsResponse = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": fieldMask,
      },
    })

    if (!detailsResponse.ok) {
      const errorText = await detailsResponse.text()
      throw new Error(`Google API error: ${detailsResponse.status} - ${errorText}`)
    }

    const data = await detailsResponse.json()

    if (data.error || data.errormessage) {
      console.error("Place details API error:", data)
      return NextResponse.json(
        {
          latitude: null,
          longitude: null,
          formattedAddress: null,
          state: null,
          error_message: data.error?.message ?? data.errormessage ?? null,
        },
        { status: 400 }
      )
    }

    const addressComponents: Array<{ types?: string[]; longText?: string; shortText?: string }> = Array.isArray(data.addressComponents)
      ? data.addressComponents
      : []

    const stateComponent = addressComponents.find(component =>
      Array.isArray(component.types) && component.types.includes("administrative_area_level_1")
    )

    const latitude = data.location?.latitude ?? null
    const longitude = data.location?.longitude ?? null

    return NextResponse.json({
      latitude,
      longitude,
      formattedAddress: data.formattedAddress ?? data.shortFormattedAddress ?? data.displayName?.text ?? null,
      state: stateComponent?.longText ?? stateComponent?.shortText ?? null,
      googleMapsUri: data.googleMapsUri ?? null,
    })
  } catch (error) {
    console.error("Place details error:", error)
    return NextResponse.json({ error: "Failed to fetch place details" }, { status: 500 })
  }
}

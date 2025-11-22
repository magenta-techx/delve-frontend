import { type NextRequest, NextResponse } from "next/server"

interface PlacesAutocompleteRequest {
  input?: string
  sessionToken?: string
  locationBias?: unknown
}

export async function POST(request: NextRequest) {
  const { input, sessionToken, locationBias }: PlacesAutocompleteRequest = await request.json()

  if (!input || input.trim().length === 0) {
    return NextResponse.json({ predictions: [] })
  }

  const apiKey = process.env["GOOGLE_MAPS_API_KEY"]

  if (!apiKey) {
    return NextResponse.json({ error: "Google Maps API key not configured" }, { status: 500 })
  }

  try {
    const body: Record<string, unknown> = {
      input,
      languageCode: "en",
      includedRegionCodes: ["ng"],
    }

    if (sessionToken) {
      body['sessionToken'] = sessionToken
    }

    if (locationBias) {
      body['locationBias'] = locationBias
    }

    const placesResponse = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": [
          "suggestions.placePrediction.placeId",
          "suggestions.placePrediction.place",
          "suggestions.placePrediction.text.text",
          "suggestions.placePrediction.structuredFormat.mainText.text",
          "suggestions.placePrediction.structuredFormat.secondaryText.text"
        ].join(","),
      },
      body: JSON.stringify(body),
    })

    if (!placesResponse.ok) {
      const errorText = await placesResponse.text()
      throw new Error(`Google API error: ${placesResponse.status} - ${errorText}`)
    }

    const data = await placesResponse.json()

    if (data.error || data.errormessage || (data.status && data.status !== "OK")) {
      console.error("Places autocomplete API error:", data)
      return NextResponse.json(
        {
          predictions: [],
          status: data.status ?? "ERROR",
          error_message: data.error?.message ?? data.errormessage ?? null,
        },
        { status: 400 }
      )
    }

    type RawSuggestion = {
      placePrediction?: {
        place?: string
        placeId?: string
        text?: { text?: string }
        structuredFormat?: {
          mainText?: { text?: string }
          secondaryText?: { text?: string }
        }
      }
    }

    const suggestions: RawSuggestion[] = Array.isArray(data.suggestions)
      ? (data.suggestions as RawSuggestion[])
      : []

    const predictions = suggestions
      .map(suggestion => suggestion.placePrediction)
      .filter((prediction): prediction is NonNullable<RawSuggestion["placePrediction"]> => Boolean(prediction))
      .map(prediction => {
        const placeId: string | undefined = prediction.placeId ?? prediction.place?.replace(/^places\//, "")
        return {
          place_id: placeId,
          place: prediction.place ?? (placeId ? `places/${placeId}` : undefined),
          description: prediction.text?.text ?? "",
          structured_formatting: {
            main_text: prediction.structuredFormat?.mainText?.text ?? prediction.text?.text ?? "",
            secondary_text: prediction.structuredFormat?.secondaryText?.text ?? "",
          },
        }
      })

    return NextResponse.json({
      predictions,
      status: "OK",
    })
  } catch (error) {
    console.error("Places autocomplete error:", error)
    return NextResponse.json({ error: "Failed to fetch autocomplete suggestions" }, { status: 500 })
  }
}

"use client"
import type React from "react"
import { useState, useCallback, useEffect, useRef } from "react"
import { MapPin, Loader2, X } from "lucide-react"
import { Input } from "@/components/ui"
import { cn } from "@/lib/utils"

interface LocationSuggestion {
  id: string
  name: string
  address: string
  latitude: number
  longitude: number
}

interface LocationSearchProps {
  value: string
  onSelect: (location: LocationSuggestion) => void
  disabled?: boolean
  placeholder?: string
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  value,
  onSelect,
  disabled = false,
  placeholder = "Enter location",
}) => {
  const [input, setInput] = useState(value)
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const searchLocations = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setSuggestions([])
      return
    }

    setLoading(true)
    try {
      // Using Nominatim API (free, no key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      )

      if (!response.ok) throw new Error("Failed to fetch suggestions")

      const data = await response.json()

      const results: LocationSuggestion[] = data.map((item: any) => ({
        id: item.osm_id.toString(),
        name: item.name,
        address: item.display_name,
        latitude: Number.parseFloat(item.lat),
        longitude: Number.parseFloat(item.lon),
      }))

      setSuggestions(results)
      setSelectedIndex(-1)
    } catch (error) {
      console.error("Error fetching location suggestions:", error)
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(input)
    }, 300)

    return () => clearTimeout(timer)
  }, [input, searchLocations])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev))
        break
      case "ArrowUp":
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case "Enter":
        e.preventDefault()
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          handleSelect(suggestions[selectedIndex])
        }
        break
      case "Escape":
        setIsOpen(false)
        break
    }
  }

  const handleSelect = (location: LocationSuggestion) => {
    setInput(location.name)
    setSuggestions([])
    setIsOpen(false)
    onSelect(location)
  }

  const handleClear = () => {
    setInput("")
    setSuggestions([])
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <MapPin
          size={20}
          className={`absolute left-3 top-1/2 -translate-y-1/2 transform ${
            disabled ? "text-gray-400" : "text-gray-600"
          }`}
        />
        <Input
          type="text"
          placeholder={placeholder}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => input && suggestions.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="pl-10 pr-10"
          autoComplete="off"
        />
        {loading && (
          <Loader2 size={20} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
        )}
        {input && !loading && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              onMouseEnter={() => setSelectedIndex(index)}
              className={cn(
                "w-full px-4 py-3 text-left text-sm transition-colors flex items-start gap-3",
                index === selectedIndex ? "bg-purple-50" : "hover:bg-gray-50",
              )}
            >
              <MapPin size={16} className="mt-0.5 flex-shrink-0 text-purple-600" />
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 truncate">{suggestion.name}</div>
                <div className="text-xs text-gray-500 truncate">{suggestion.address}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {suggestion.latitude.toFixed(4)}, {suggestion.longitude.toFixed(4)}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && input.length >= 2 && !loading && suggestions.length === 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg p-4 text-center text-sm text-gray-500">
          No locations found
        </div>
      )}
    </div>
  )
}

export default LocationSearch

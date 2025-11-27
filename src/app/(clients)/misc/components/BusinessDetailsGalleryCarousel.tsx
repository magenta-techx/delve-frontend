"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"

interface BusinessDetailsGalleryCarouselProps {
  images: (string | { id: string | number; image: string })[]
  initialIndex: number
  isOpen: boolean
  onClose: () => void
}

export function BusinessDetailsGalleryCarousel({ images, initialIndex, isOpen, onClose }: BusinessDetailsGalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex, isOpen])

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrevious()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, isOpen, onClose])

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  const getCurrentImageSrc = () => {
    const image = images[currentIndex]
    return typeof image === "string" ? image : image?.image
  }

  const visibleThumbnails = 7
  const thumbnailStart = Math.max(0, currentIndex - Math.floor(visibleThumbnails / 2))
  const thumbnailEnd = Math.min(images.length, thumbnailStart + visibleThumbnails)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-lg">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute right-6 top-6 z-50 rounded-full bg-black/30 p-2 hover:bg-black/50 transition-colors"
        aria-label="Close gallery"
      >
        <X className="h-6 w-6 text-white" />
      </button>

      {/* Main image */}
      <div className="relative flex h-[72vh] w-full max-w-6xl items-center justify-center px-4">
        <Image
          src={getCurrentImageSrc() || "/placeholder.svg"}
          alt={`Gallery image ${currentIndex + 1}`}
          fill
          className="object-contain rounded-2xl"
          priority
          sizes="(max-width: 1536px) 100vw, 1536px"
        />

        {/* Image counter */}
        {/* <div className="absolute left-6 top-6 text-white text-lg font-medium bg-black/30 px-4 py-2 rounded">
          {currentIndex + 1} / {images.length}
        </div> */}
      </div>

      {/* Navigation arrows */}
      <button 
        onClick={handlePrevious}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-40 rounded-full border-2 border-white p-3 hover:bg-white/10 transition-colors"
        aria-label="Previous image"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-40 rounded-full border-2 border-white p-3 hover:bg-white/10 transition-colors"
        aria-label="Next image"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Thumbnail strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-4 py-8">
        <div className="mx-auto flex justify-center gap-2 overflow-x-auto">
          {images.slice(thumbnailStart, thumbnailEnd).map((image, i) => {
            const actualIndex = thumbnailStart + i
            const src = typeof image === "string" ? image : image.image
            return (
              <button
                key={actualIndex}
                onClick={() => setCurrentIndex(actualIndex)}
                className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded border-2 transition-all ${
                  actualIndex === currentIndex ? "border-white scale-110" : "border-gray-600 hover:border-white"
                }`}
                aria-label={`Go to image ${actualIndex + 1}`}
              >
                <Image
                  src={src || "/placeholder.svg"}
                  alt={`Thumbnail ${actualIndex + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

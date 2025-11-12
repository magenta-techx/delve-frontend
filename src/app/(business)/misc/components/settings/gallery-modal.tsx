"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { CloudUpload, X } from "lucide-react"
import { useRef } from "react"

interface GalleryModalProps {
  onClose: () => void
  images: string[]
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function GalleryModal({ onClose, images, onUpload }: GalleryModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <h2 className="text-xl font-semibold">Gallery</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Upload Section */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-medium">Select & Delete</h3>
            <Button onClick={() => fileInputRef.current?.click()} className="bg-primary text-white hover:bg-primary/90">
              <CloudUpload className="w-4 h-4 mr-2" />
              Upload media
            </Button>
            <input ref={fileInputRef} type="file" multiple onChange={onUpload} className="hidden" accept="image/*" />
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-3 gap-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                  <img src={img || "/placeholder.svg"} alt="Gallery" className="w-full h-full object-cover" />
                </div>
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="destructive" className="h-6 w-6 p-0">
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

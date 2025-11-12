"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GalleryModal } from "@/components/business/settings/gallery-modal"

export function ProfileTab() {
  const [showGalleryModal, setShowGalleryModal] = useState(false)
  const [galleryImages, setGalleryImages] = useState([
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
    "https://images.unsplash.com/photo-1556858221-b3cab9c47dad",
    "https://images.unsplash.com/photo-1600788517324-14a0a3e3f04c",
  ])
  const [categories, setCategories] = useState(["Spas & Wellness", "Spas & Wellness", "Spas & Wellness"])
  const [amenities, setAmenities] = useState(["Wheelchair accessible", "Wheelchair", "Wifi"])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
      setGalleryImages([...galleryImages, ...newImages])
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile Picture */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a" />
              <AvatarFallback>ROZA</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGalleryModal(true)}
              className="text-primary hover:text-primary"
            >
              Change
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Select from your uploads</p>
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gallery</CardTitle>
          <Button
            variant="outline"
            size="sm"
            className="text-primary hover:text-primary bg-transparent"
            onClick={() => setShowGalleryModal(true)}
          >
            View and upload
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {galleryImages.map((img, idx) => (
              <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-muted">
                <img src={img || "/placeholder.svg"} alt="Gallery" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Categories */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Business Categories</CardTitle>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {categories.map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm">{cat}</span>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subcategories */}
      <Card>
        <CardHeader>
          <CardTitle>Subcategories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["Wheelchair accessible", "Wheelchair accessible", "Wheelchair accessible"].map((sub, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm flex items-center gap-2">
                  <span className="text-primary">⌂</span> {sub}
                </span>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Business Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Business Amenities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {amenities.map((amenity, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm flex items-center gap-2">
                  <span className="text-primary">⌂</span> {amenity}
                </span>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                  ✕
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Gallery Modal */}
      {showGalleryModal && (
        <GalleryModal onClose={() => setShowGalleryModal(false)} images={galleryImages} onUpload={handleImageUpload} />
      )}
    </div>
  )
}

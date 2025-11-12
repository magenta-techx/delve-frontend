"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Upload } from "lucide-react"

export function GalleryWidget() {
  const images = [
    "https://images.unsplash.com/photo-1611591437281-460bfbe1220a",
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f",
    "https://images.unsplash.com/photo-1556858221-b3cab9c47dad",
    "https://images.unsplash.com/photo-1600788517324-14a0a3e3f04c",
    "https://images.unsplash.com/photo-1600788517325-14a0a3e3f04d",
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Gallery
        </CardTitle>
        <Button variant="outline" size="sm" className="text-primary hover:text-primary bg-transparent">
          <Upload className="w-4 h-4 mr-2" />
          Add Images
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-lg overflow-hidden bg-muted hover:opacity-75 transition-opacity cursor-pointer"
            >
              <img src={img || "/placeholder.svg"} alt="Gallery" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

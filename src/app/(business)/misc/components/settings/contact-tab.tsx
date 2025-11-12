"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { MapPin, Instagram, MessageCircle } from "lucide-react"

export function ContactTab() {
  const [formData, setFormData] = useState({
    state: "Lagos",
    location: "12, Adenuga Tiwo Str, Ikeja",
    instagram: "https://www.instagram.com/retyigv=ggb4566tcrt5",
    whatsapp: "Wa.me/2349012345678",
  })

  return (
    <div className="space-y-6">
      {/* State */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">State</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="Enter state"
          />
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Business Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Business Location?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 p-3 border rounded-lg">
            <MapPin className="w-5 h-5 text-muted-foreground" />
            <Input
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="Enter location"
              className="border-0 p-0"
            />
          </div>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </CardContent>
      </Card>

      {/* Socials */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Socials</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Instagram */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Instagram className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-medium">Instagram Link</span>
            </div>
            <Input
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="Instagram URL"
              className="text-sm"
            />
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>

          {/* WhatsApp */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              <span className="text-sm font-medium">Whatsapp Link</span>
            </div>
            <Input
              value={formData.whatsapp}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              placeholder="WhatsApp URL"
              className="text-sm"
            />
            <Button variant="outline" size="sm">
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Save and Preview */}
      <div className="flex justify-center gap-4 pt-6">
        <Button className="bg-primary text-white hover:bg-primary/90" size="lg">
          Preview Business Profile →
        </Button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"

export function GeneralTab() {
  const [formData, setFormData] = useState({
    businessName: "Delve Nigeria",
    about:
      "Full-Service Event Planning, Partial Planning, Day-Of Coordination, Event Consultation Sessions, Destination Event Planning, Proposal & Elopement Planning.",
    website: "www.delve.com",
  })

  return (
    <div className="space-y-6">
      {/* Business Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Business Logo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a" />
              <AvatarFallback>ROZA</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                png, .jpeg files up to 8MB. Recommended size is 256 × 256px
              </p>
              <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Name */}
      <Card>
        <CardHeader>
          <CardTitle>Business Name</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={formData.businessName}
            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
            placeholder="Enter business name"
          />
        </CardContent>
      </Card>

      {/* About Business */}
      <Card>
        <CardHeader>
          <CardTitle>About Business</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.about}
            onChange={(e) => setFormData({ ...formData, about: e.target.value })}
            placeholder="Describe your business"
            className="min-h-24"
          />
        </CardContent>
      </Card>

      {/* Website */}
      <Card>
        <CardHeader>
          <CardTitle>Website (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://www.example.com"
          />
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancel</Button>
        <Button className="bg-primary text-white hover:bg-primary/90">Save Changes</Button>
      </div>
    </div>
  )
}

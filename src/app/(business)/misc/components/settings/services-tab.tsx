"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"

interface Service {
  id: string
  name: string
  description: string
  image?: string
}

export function ServicesTab() {
  const [services, setServices] = useState<Service[]>([
    {
      id: "1",
      name: "Event Planning & Coordination",
      description:
        "Full-Service Event Planning, Partial Planning, Day-Of Coordination, Event Consultation Sessions, Destination Event Planning, Proposal & Elopement Planning.",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a",
    },
    {
      id: "2",
      name: "Event Planning & Coordination",
      description:
        "Full-Service Event Planning, Partial Planning, Day-Of Coordination, Event Consultation Sessions, Destination Event Planning, Proposal & Elopement Planning.",
    },
  ])

  const handleAddService = () => {
    const newService: Service = {
      id: Date.now().toString(),
      name: "",
      description: "",
    }
    setServices([...services, newService])
  }

  const handleUpdateService = (id: string, field: keyof Service, value: string) => {
    setServices(services.map((service) => (service.id === id ? { ...service, [field]: value } : service)))
  }

  const handleRemoveService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  return (
    <div className="space-y-6">
      {services.map((service) => (
        <Card key={service.id}>
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Service</Label>
                <Input
                  value={service.name}
                  onChange={(e) => handleUpdateService(service.id, "name", e.target.value)}
                  placeholder="Service name"
                  className="mt-1"
                />
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Description */}
            <div>
              <Label className="text-sm text-muted-foreground">Description</Label>
              <Textarea
                value={service.description}
                onChange={(e) => handleUpdateService(service.id, "description", e.target.value)}
                placeholder="Service description"
                className="mt-1 min-h-24"
              />
            </div>

            {/* Service Image */}
            <div>
              <Label className="text-sm text-muted-foreground">Service Image</Label>
              {service.image ? (
                <div className="mt-2 relative aspect-video rounded-lg overflow-hidden bg-muted">
                  <img src={service.image || "/placeholder.svg"} alt="Service" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2">
                    <Button size="sm" variant="destructive" className="h-6 w-6 p-0">
                      ✕
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                  <p className="text-sm text-muted-foreground">Select from files</p>
                  <Button variant="outline" size="sm" className="mt-2 text-primary hover:text-primary bg-transparent">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10"
                onClick={() => handleRemoveService(service.id)}
              >
                Delete Service
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
                <Button className="bg-primary text-white hover:bg-primary/90" size="sm">
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Add Service Button */}
      <Button
        onClick={handleAddService}
        variant="outline"
        className="w-full border-dashed text-primary hover:text-primary bg-transparent"
      >
        + Add Service
      </Button>
    </div>
  )
}

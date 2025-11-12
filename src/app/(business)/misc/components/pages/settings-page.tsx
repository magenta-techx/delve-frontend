"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GeneralTab } from "@/components/business/settings/general-tab"
import { ProfileTab } from "@/components/business/settings/profile-tab"
import { ServicesTab } from "@/components/business/settings/services-tab"
import { ContactTab } from "@/components/business/settings/contact-tab"

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Roza Spa</h1>
            <p className="text-muted-foreground">Manage your business details and account settings</p>
          </div>
          <Button
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
          >
            Deactivate
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="w-full justify-start border-b rounded-none p-0 bg-transparent">
            <TabsTrigger
              value="general"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="services"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Services
            </TabsTrigger>
            <TabsTrigger
              value="contact"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="general">
            <GeneralTab />
          </TabsContent>
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="services">
            <ServicesTab />
          </TabsContent>
          <TabsContent value="contact">
            <ContactTab />
          </TabsContent>
        </Tabs>

        {/* Preview and Save */}
        <div className="flex justify-center gap-4 pt-6">
          <Button className="bg-primary text-white hover:bg-primary/90" size="lg">
            Preview Business Profile →
          </Button>
        </div>
      </div>
    </div>
  )
}

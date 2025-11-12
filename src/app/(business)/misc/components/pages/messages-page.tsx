"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Send, Trash2 } from "lucide-react"

export function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1)

  const conversations = [
    {
      id: 1,
      name: "Ruth",
      avatar: "👩",
      lastMessage: "Hi there! Yes, we can absolutely recreate that look for indoor venues. What's the...",
      date: "11 June",
      unread: false,
    },
    {
      id: 2,
      name: "Aura",
      avatar: "A",
      lastMessage: "Perfect! I'll share our wedding decor packages with you shortly. Can I send t...",
      date: "23 June",
      unread: false,
    },
    {
      id: 3,
      name: "Kelvin",
      avatar: "K",
      lastMessage: "Hi, do you deliver to Lekki Phase 1?",
      date: "18 June",
      unread: false,
    },
    {
      id: 4,
      name: "Roza Luxe",
      avatar: "R",
      lastMessage: "Hi! Let me check my calendar... Yes, I'm available that day! Would you like home...",
      date: "11 June",
      unread: false,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "other",
      text: "We'd love to help. Do you have any skin concerns you want to focus on?",
    },
    {
      id: 2,
      sender: "user",
      text: "Mainly dullness and hyperpigmentation.",
    },
    {
      id: 3,
      sender: "other",
      text: "Can I send you the details?",
    },
    {
      id: 4,
      sender: "user",
      text: "Great, we recommend our Bridal Glow Plan. It includes 3 sessions spaced out weekly.",
    },
  ]

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Messages list */}
      <div className="w-80 border-r border-border bg-background flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Type to search" className="pl-10" />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv.id)}
              className={`w-full p-4 border-b border-border text-left hover:bg-muted/50 transition-colors ${
                selectedConversation === conv.id ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                  {conv.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm">{conv.name}</h4>
                  <p className="text-xs text-muted-foreground truncate">{conv.lastMessage}</p>
                  <p className="text-xs text-muted-foreground mt-1">{conv.date}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Conversation view */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Conversation with Aura</h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
            <Button variant="ghost" size="sm">
              View profile
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "bg-muted text-foreground"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Input placeholder="Write your message..." />
            <Button size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

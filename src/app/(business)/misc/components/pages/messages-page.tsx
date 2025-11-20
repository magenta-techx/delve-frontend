"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui"
import { Button } from "@/components/ui"
import { Search, Send, Trash2 } from "lucide-react"
import Link from "next/link"
import { useBusinessChats } from "@/hooks/chat/useBusinessChats"
import { useChatMessages } from "@/hooks/chat/useChatMessages"
import { useBusinessContext } from "@/contexts/BusinessContext"

export function MessagesPage() {
  const { currentBusiness } = useBusinessContext()
  const businessId = currentBusiness?.id ?? null

  const convQuery = useBusinessChats(businessId)
  const convLoading = convQuery.isLoading
  const conversations = convQuery.data?.data ?? []

  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedConversation && Array.isArray(conversations) && conversations.length > 0) {
      const first = conversations[0] as any
      const id = String(first.id ?? first.chat_id ?? first._id ?? first?.chatId ?? first?.customer?.id ?? '')
      if (id) setSelectedConversation(id)
    }
  }, [conversations, selectedConversation])

  const { data: messages = [], loading: messagesLoading } = useChatMessages(selectedConversation)

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Messages list */}
      <div className="w-80 border-r border-border bg-background flex flex-col">
        {/* Search */}
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search chats" className="pl-10" />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {convLoading && <div className="p-4">Loading...</div>}
          {!convLoading && (!conversations || conversations.length === 0) && <div className="p-4">No chats yet</div>}
          {conversations && conversations.map((conv: any) => {
            const id = String(conv.id ?? conv.chat_id ?? conv._id ?? conv?.chatId ?? conv?.customer?.id ?? Math.random())
            const avatar = conv.customer?.profile_image ?? conv.avatar ?? conv.name?.[0] ?? 'U'
            const name = `${conv.customer?.first_name ?? ''} ${conv.customer?.last_name ?? ''}`.trim() || conv.name || conv.user?.name || 'Chat'
            const lastMessage = conv.last_message?.content ?? conv.lastMessage ?? conv?.last_message ?? ''

            return (
              <Link key={id} href={`/business/messages/${id}`} className={`block w-full p-4 border-b border-border text-left hover:bg-muted/50 transition-colors`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                    {avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{lastMessage}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Conversation view */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Header */}
        <div className="h-16 border-b border-border px-6 flex items-center justify-between">
          <div>
            <h2 className="font-semibold">{conversations && selectedConversation ? `Conversation` : 'Select a conversation'}</h2>
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
          {messagesLoading && <div>Loading messages...</div>}
          {!messagesLoading && (!messages || messages.length === 0) && (
            <div className="text-muted-foreground">No messages to show.</div>
          )}
          {messages && messages.map((msg: any) => (
            <div key={String(msg.id ?? msg._id ?? Math.random())} className={`flex ${msg.is_sender || msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.is_sender || msg.sender === 'user'
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'bg-muted text-foreground'
                }`}
              >
                <p className="text-sm">{msg.text ?? msg.message ?? msg.body ?? ''}</p>
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

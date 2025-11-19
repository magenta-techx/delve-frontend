"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui"
import { Button } from "@/components/ui"
import { Search, Send, Image as ImageIcon } from "lucide-react"
import Image from "next/image"
import { useUserChats } from "@/hooks/chat/useUserChats"
import Link from "next/link"
import { useAddImage } from "@/hooks/chat/useAddImage"
import { useSession } from "next-auth/react"

export default function UserChatsPage(): JSX.Element {
  const { data: conversations, loading: convLoading, refresh: refreshConversations } = useUserChats()

  type Conversation = {
    id?: string | number
    chat_id?: string | number
    _id?: string | number
    business_id?: string | number
    businessId?: string | number
    biz_id?: string | number
    avatar?: string
    name?: string
    user?: { name?: string }
    lastMessage?: string
    last_message?: string
  }

  type Message = {
    id?: string | number
    _id?: string | number
    sender?: string
    is_sender?: boolean
    text?: string
    message?: string
    body?: string
    image?: string
  }

  const { data: session } = useSession()
  const token = session?.user?.accessToken ?? ""
  const { addImage } = useAddImage()

  const sendFileFromInput = async (e: React.ChangeEvent<HTMLInputElement>, chatId?: string | null) => {
    const file = e.target.files?.[0] ?? null
    if (!file || !chatId) return
    const fd = new FormData()
    fd.append("images", file)
    fd.append("chat_id", chatId)
    try {
      await addImage(fd)
      void refreshConversations()
    } catch (err) {
      // ignore for now
    }
    if (e.target) e.target.value = ''
  }

  return (
    <div className="flex h-[calc(100vh-64px)]">
      <div className="w-80 border-r border-border bg-background flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search chats" className="pl-10" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {convLoading && <div className="p-4">Loading...</div>}
          {!convLoading && (!conversations || conversations.length === 0) && <div className="p-4">No chats yet</div>}
          {conversations && conversations.map((conv: Conversation) => {
            const id = String(conv.id ?? conv.chat_id ?? conv._id ?? conv?.id)
            return (
              <Link key={id} href={`/chats/${id}`} className={`block w-full p-4 border-b border-border text-left hover:bg-muted/50 transition-colors`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                    {conv.avatar ?? conv.name?.[0] ?? 'U'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{conv.name ?? conv.user?.name ?? 'Chat'}</h4>
                    <p className="text-xs text-muted-foreground truncate">{conv.lastMessage ?? conv?.last_message ?? ''}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-background items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">Select a chat to view messages</p>
          <p className="text-sm mt-2">Click any conversation on the left to open its messages.</p>
        </div>
      </div>
    </div>
  )
}

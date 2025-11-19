"use client"

import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Input } from "@/components/ui"
import { Button } from "@/components/ui"
import { Send, Image as ImageIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useUserChats } from "@/hooks/chat/useUserChats"
import { useChatMessages } from "@/hooks/chat/useChatMessages"
import { useChatSocket } from "@/hooks/chat/useChatSocket"
import { useAddImage } from "@/hooks/chat/useAddImage"

export default function ChatDetailPage({ params }: { params: { chat_id: string } }) {
  const { chat_id } = params
  const { data: session } = useSession()
  const token = session?.user?.accessToken ?? ""

  const { data: conversations = [], loading: convLoading, refresh: refreshConversations } = useUserChats()
  // find conversation to derive business id
  const conv = conversations?.find((c: any) => String(c.id ?? c.chat_id ?? c._id ?? c?.id) === String(chat_id))
  const businessId = conv?.business_id ?? conv?.businessId ?? conv?.biz_id ?? ''

  const { data: messages = [], loading: messagesLoading, refresh: refreshMessages } = useChatMessages(chat_id)

  const { send } = useChatSocket({
    businessId: String(businessId ?? ''),
    chatId: String(chat_id),
    token: token ?? '',
    onMessage: () => {
      void refreshMessages()
      void refreshConversations()
    },
    onImages: () => {
      void refreshMessages()
      void refreshConversations()
    },
  })

  const { addImage } = useAddImage()
  const [text, setText] = useState("")
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendFileFromInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    if (!file) return
    const fd = new FormData()
    fd.append('images', file)
    fd.append('chat_id', String(chat_id))
    try {
      await addImage(fd)
      void refreshMessages()
      void refreshConversations()
    } catch (err) {
      // ignore
    }
    if (e.target) e.target.value = ''
  }

  const handleSend = async () => {
    if (!text) return
    try {
      // attempt to send over websocket
      // backend may expect a JSON string; send raw text if needed
      if (typeof send === 'function') {
        try {
          send(JSON.stringify({ text }))
        } catch (_) {
          // fallback: try sending plain text
          send(text as any)
        }
      }
      setText('')
      void refreshMessages()
    } catch (err) {
      // ignore
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-background">
      <div className="h-16 border-b border-border px-6 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">{conv?.name ?? 'Conversation'}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm">View profile</Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messagesLoading && <div>Loading messages...</div>}
        {messages && messages.length === 0 && <div>No messages yet</div>}
        {messages && messages.map((msg: any) => (
          <div key={msg.id ?? msg._id ?? Math.random()} className={`flex ${msg.sender === 'user' || msg.is_sender ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user' || msg.is_sender ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-muted text-foreground'}`}>
              <p className="text-sm">{msg.text ?? msg.message ?? msg.body ?? ''}</p>
              {msg.image && (
                <div className="mt-2 max-w-full rounded overflow-hidden">
                  <Image src={String(msg.image)} alt="img" width={400} height={300} className="w-full h-auto rounded" />
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border p-4">
        <div className="flex gap-2 items-center">
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your message..." />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="file" accept="image/*" onChange={sendFileFromInput} className="hidden" />
            <Button size="icon"><ImageIcon className="w-4 h-4" /></Button>
          </label>
          <Button size="icon" onClick={handleSend}><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  )
}

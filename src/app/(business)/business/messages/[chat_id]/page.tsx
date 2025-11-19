"use client"

import React, { useEffect, useRef, useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui"
import { Button } from "@/components/ui"
import { Send, Image as ImageIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import { useChatMessages } from "@/hooks/chat/useChatMessages"
import { useChatSocket } from "@/hooks/chat/useChatSocket"
import { useAddImage } from "@/hooks/chat/useAddImage"
import { useBusinessContext } from "@/contexts/BusinessContext"

export default function BusinessChatDetail({ params }: { params: { chat_id: string } }) {
  const { chat_id } = params
  const { data: session } = useSession()
  const token = session?.user?.accessToken ?? ""

  const { data: messages = [], loading: messagesLoading, refresh: refreshMessages } = useChatMessages(chat_id)

  // businessId might be discoverable from messages or session; for now use session.businessId or empty
  const { currentBusiness } = useBusinessContext()
  const businessId = currentBusiness?.id ?? ''

  const { send } = useChatSocket({
    businessId: String(businessId ?? ''),
    chatId: String(chat_id),
    token: token ?? '',
    onMessage: () => void refreshMessages(),
    onImages: () => void refreshMessages(),
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
    } catch (err) {
      // ignore
    }
    if (e.target) e.target.value = ''
  }

  const handleSend = async () => {
    if (!text) return
    try {
      if (typeof send === 'function') {
        try {
          send(JSON.stringify({ text }))
        } catch (_) {
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
          <h2 className="font-semibold">Business Chat</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messagesLoading && <div>Loading messages...</div>}
        {messages && messages.length === 0 && <div>No messages yet</div>}
        {messages && messages.map((msg: any) => (
          <div key={msg.id ?? msg._id ?? Math.random()} className={`flex ${msg.sender === 'business' || msg.is_sender ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'business' || msg.is_sender ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-muted text-foreground'}`}>
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

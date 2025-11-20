"use client"

import { Input } from "@/components/ui"
import { Search } from "lucide-react"
import { useUserChats } from "@/hooks/chat/useUserChats"
import Link from "next/link"
// Note: image upload handled elsewhere; no upload logic required in this list view

export default function UserChatsPage(): JSX.Element {
  const convQuery = useUserChats()
  const convLoading = convQuery.isLoading
  const conversations = Array.isArray(convQuery.data?.data) ? convQuery.data.data : []

  

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
          {conversations && conversations.map((conv) => {
            const id = String(conv.id ?? conv.chat_id ?? conv._id ?? conv?.id)
            const avatar = conv.avatar ?? conv.name?.[0] ?? 'U'
            const name = conv.name ?? conv.user?.name ?? 'Chat'
            let preview = ''
            const lm = conv.last_message ?? conv.lastMessage
            if (lm) {
              if (typeof lm === 'string') preview = lm
              else preview = lm.content ?? lm.message ?? lm.text ?? ''
            }

            return (
              <Link key={id} href={`/chats/${id}`} className={`block w-full p-4 border-b border-border text-left hover:bg-muted/50 transition-colors`}>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
                    {avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{name}</h4>
                    <p className="text-xs text-muted-foreground truncate">{preview}</p>
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

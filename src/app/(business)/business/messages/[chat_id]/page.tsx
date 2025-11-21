// "use client"

// import React, { useEffect, useRef, useState } from "react"
// import { useRouter } from "next/navigation"
// import Image from "next/image"
// import { Input } from "@/components/ui"
// import { Button } from "@/components/ui"
// import { Send, Image as ImageIcon } from "lucide-react"
// import { useSession } from "next-auth/react"
// import { useUserChats } from "@/app/(clients)/misc/api/useUserChats"
// import { useChatSocket } from "@/hooks/chat/useChatSocket"
// import { useAddImage } from "@/hooks/chat/useAddImage"
// import { useChatMessages } from "@/app/(clients)/misc/api"
// import { useBusinessChats } from "@/app/(business)/misc/api"
// import { useBusinessContext } from "@/contexts/BusinessContext"

// export default function ChatDetailPage({ params }: { params: { chat_id: string } }) {
//   const { chat_id } = params
//   const { data: session } = useSession()
//   // const currentUserId = session?.user?.id ?? ""
//   const token = session?.user?.accessToken ?? ""

//   const {currentBusiness} = useBusinessContext();
//   const businessId = currentBusiness?.id ?? null

//     const { data: chats, isLoading: isLoadingChats } = useBusinessChats(businessId);

//   const { data: messages, isLoading: messagesLoading, refetch: refreshMessages } = useChatMessages(chat_id)

//   const selectedCHat = chats?.data.find(c => String(c.id) === String(chat_id)) || null;

//   const { send } = useChatSocket({
//     // businessId: String(businessId ?? ''),
//     businessId: String(selectedCHat?.business?.id ?? ''),
//     chatId: String(chat_id),
//     token: token ?? '',
//     onMessage: () => {
//       void refreshMessages()
//       // void refreshConversations()
//     },
//     onImages: () => {
//       void refreshMessages()
//       // void refreshConversations()
//     },
//   })

//   const { addImage } = useAddImage()
//   const [text, setText] = useState("")
//   const bottomRef = useRef<HTMLDivElement | null>(null)

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   const sendFileFromInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null
//     if (!file) return
//     const fd = new FormData()
//     fd.append('images', file)
//     fd.append('chat_id', String(chat_id))
//     try {
//       await addImage(fd)
//       void refreshMessages()
//     } catch (err) {
//       // ignore
//     }
//     if (e.target) e.target.value = ''
//   }

//   const handleSend = async () => {
//     if (!text) return
//     try {
//       // attempt to send over websocket
//       // backend may expect a JSON string; send raw text if needed
//       if (typeof send === 'function') {
//         try {
//           send(JSON.stringify({ text }))
//         } catch (_) {
//           // fallback: try sending plain text
//           send(text as any)
//         }
//       }
//       setText('')
//       void refreshMessages()
//     } catch (err) {
//       // ignore
//     }
//   }

//   return (
//     <div className="flex-1 flex flex-col bg-background">
//       <div className="h-16 border-b border-border px-6 flex items-center justify-between">
//         <div>
//           <h2 className="font-semibold">{selectedCHat?.business.name ?? 'Conversation'}</h2>
//         </div>
//         <div className="flex items-center gap-2">
//           <Button variant="ghost" size="sm">View profile</Button>
//         </div>
//       </div>

//       <div className="flex-1 overflow-y-auto p-6 space-y-4">
//         {messagesLoading && <div>Loading messages...</div>}
//         {messages && messages.data.length === 0 && <div>No messages yet</div>}
//         {messages && messages.data.map((msg) => (
//           <div key={Math.random()} className={`flex ${msg.sender.id === 'user' || msg.sender.id == session?.user.id ? 'justify-end' : 'justify-start'}`}>
//             <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender.id === 'user' ||  msg.sender.id == session?.user.id  ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'bg-muted text-foreground'}`}>
//               <p className="text-sm">{msg.content ?? ''}</p>
//               {msg.is_image_message && (
//                 <div className="mt-2 max-w-full rounded overflow-hidden">
//                   <Image src={String(msg.image)} alt="img" width={400} height={300} className="w-full h-auto rounded" />
//                 </div>
//               )}
//             </div>
//           </div>
//         ))}
//         <div ref={bottomRef} />
//       </div>

//       <div className="border-t border-border p-4">
//         <div className="flex gap-2 items-center">
//           <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your message..." />
//           <label className="flex items-center gap-2 cursor-pointer">
//             <input type="file" accept="image/*" onChange={sendFileFromInput} className="hidden" />
//             <Button size="icon"><ImageIcon className="w-4 h-4" /></Button>
//           </label>
//           <Button size="icon" onClick={handleSend}><Send className="w-4 h-4" /></Button>
//         </div>
//       </div>
//     </div>
//   )
// }


import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page
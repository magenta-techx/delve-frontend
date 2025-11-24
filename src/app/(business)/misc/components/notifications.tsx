"use client"

export function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "message",
      title: "New message from John Mark",
      time: "Fri, 23 Aug 04:32 pm",
      icon: "💬",
    },
    {
      id: 2,
      type: "message",
      title: "New message from John Mark",
      time: "Fri, 23 Aug 04:32 pm",
      icon: "💬",
    },
    {
      id: 3,
      type: "subscription",
      title: "Subscription successful. View your plan",
      time: "Fri, 23 Aug 04:32 pm",
      icon: "📋",
    },
    {
      id: 4,
      type: "account",
      title: "Business account created successfully. 🎉 You can view business profile.",
      time: "Fri, 23 Aug 04:32 pm",
      icon: "✅",
    },
  ]

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <span className="text-xs bg-sidebar-primary text-sidebar-primary-foreground px-2 py-1 rounded-full">1</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-border">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="text-lg">{notification.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{notification.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

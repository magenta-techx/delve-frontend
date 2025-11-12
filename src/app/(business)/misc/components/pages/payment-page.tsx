"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronDown, Download, Settings, X } from "lucide-react"

// Sample payment data
const paymentHistoryData = [
  {
    id: 1,
    plan: "Premium plan",
    period: "Monthly",
    amount: 5000,
    status: "Successful",
    date: "10-08-2025",
    card: "3469",
  },
  {
    id: 2,
    plan: "Premium plan",
    period: "Monthly",
    amount: 5000,
    status: "Successful",
    date: "07-07-2025",
    card: "3469",
  },
  {
    id: 3,
    plan: "Premium plan",
    period: "Monthly",
    amount: 5000,
    status: "Successful",
    date: "11-06-2025",
    card: "5769",
  },
  {
    id: 4,
    plan: "Premium plan",
    period: "Monthly",
    amount: 0,
    status: "Failed",
    date: "10-06-2025",
    card: "3469",
  },
  {
    id: 5,
    plan: "Premium plan",
    period: "Monthly",
    amount: 5000,
    status: "Successful",
    date: "11-05-2025",
    card: "3469",
  },
]

interface PaymentTransaction {
  id: number
  plan: string
  period: string
  amount: number
  status: string
  date: string
  card: string
}

function ReceiptModal({
  transaction,
  onClose,
}: {
  transaction: PaymentTransaction | null
  onClose: () => void
}) {
  if (!transaction) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">4 of 24 receipt</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="py-6 space-y-6">
          {/* Subscription info */}
          <div className="flex items-start gap-4 pb-4 border-b">
            <div className="w-10 h-10 rounded-full bg-purple-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">Subscription type</p>
              <p className="font-semibold truncate">{transaction.plan}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="font-semibold">₦{transaction.amount.toLocaleString()}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <div className="border-b border-yellow-500 pb-2 mb-4">
              <h3 className="font-semibold">Payment Details</h3>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cycle</span>
                <span className="font-medium">{transaction.period}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction Date</span>
                <span className="font-medium">24 May, 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-medium">Oy7638746Ty</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`font-medium ${transaction.status === "Successful" ? "text-green-600" : "text-red-600"}`}
                >
                  {transaction.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction Method</span>
                <span className="font-medium">Card payment</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card number</span>
                <span className="font-medium">**** {transaction.card}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">User Id</span>
                <span className="font-medium">oliviarodriguez@gmail.com</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function CancelSubscriptionModal({
  variant = "confirm",
  onClose,
  onConfirm,
}: {
  variant?: "confirm" | "info"
  onClose: () => void
  onConfirm?: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            {variant === "info" ? (
              <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 font-bold text-sm">!</span>
              </div>
            ) : null}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <CardTitle>{variant === "info" ? "Important Information" : "Cancel Subscription"}</CardTitle>
                <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {variant === "info" ? (
            <>
              <div className="space-y-3 text-sm">
                <p>• Your subscription will remain active until the end of the current billing period.</p>
                <p>
                  • Canceling your subscription will remove access to Delve Premium features, including priority
                  visibility, advanced insights, and the verified badge.
                </p>
              </div>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>
                Yes, Cancel Subscription
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm">Are you sure you want to end your business subscription?</p>
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white" onClick={onConfirm}>
                Yes, Continue
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function PaymentPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<PaymentTransaction | null>(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showCancelInfo, setShowCancelInfo] = useState(false)
  const [filterPeriod, setFilterPeriod] = useState("all-time")

  // Sample current plan data
  const currentPlan = {
    name: "Free Trial",
    cycle: "7 Days",
    cost: 0.0,
    daysLeft: 6,
    hasPaymentMethod: true,
  }

  const handleCancelClick = () => {
    setShowCancelModal(false)
    setShowCancelInfo(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Payment & Subscription</h1>
        <p className="text-muted-foreground">Effortlessly handle your billing and invoices right here.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Plan Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Current Plan Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Plan name</p>
                  <p className="text-sm font-medium">{currentPlan.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Billing Cycle</p>
                  <p className="text-sm font-medium">{currentPlan.cycle}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase">Plan Cost</p>
                  <p className="text-sm font-medium">{currentPlan.cost.toFixed(2)}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Usage</p>
                <p className="text-sm font-medium mb-3">
                  You have {currentPlan.daysLeft} more days before your free trial ends
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-purple-600 h-2 rounded-full"
                    style={{
                      width: `${((7 - currentPlan.daysLeft) / 7) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment History */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment History</CardTitle>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                {filterPeriod}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {paymentHistoryData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <p className="text-muted-foreground">You don't have any history yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-2 font-semibold">Subscription plan</th>
                        <th className="text-left py-3 px-2 font-semibold">Period</th>
                        <th className="text-left py-3 px-2 font-semibold">Amount</th>
                        <th className="text-left py-3 px-2 font-semibold">Status</th>
                        <th className="text-left py-3 px-2 font-semibold">Date</th>
                        <th className="text-left py-3 px-2 font-semibold">Payment Card</th>
                        <th className="text-left py-3 px-2 font-semibold"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentHistoryData.map((transaction) => (
                        <tr key={transaction.id} className="border-b hover:bg-muted/50 cursor-pointer">
                          <td className="py-3 px-2">{transaction.plan}</td>
                          <td className="py-3 px-2">{transaction.period}</td>
                          <td className="py-3 px-2">₦{transaction.amount.toLocaleString()}</td>
                          <td className="py-3 px-2">
                            <span
                              className={`text-xs font-medium px-2 py-1 rounded ${
                                transaction.status === "Successful"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                          <td className="py-3 px-2">{transaction.date}</td>
                          <td className="py-3 px-2">**** {transaction.card}</td>
                          <td className="py-3 px-2">
                            <button
                              onClick={() => setSelectedTransaction(transaction)}
                              className="text-blue-600 hover:underline"
                            >
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Upgrade Banner */}
          <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 text-white">
            <CardContent className="pt-6">
              <h3 className="text-lg font-bold mb-3">
                Enjoying your free 7-day trial? Subscribe today to keep premium features when your trial ends.
              </h3>
              <Button
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
                onClick={() => setShowCancelModal(true)}
              >
                Upgrade to Premium →
              </Button>
            </CardContent>
          </Card>

          {/* Payment Method */}
          {currentPlan.hasPaymentMethod && (
            <Card className="bg-gradient-to-br from-purple-600 to-purple-700 border-0 text-white">
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle className="text-lg">Current Payment Method</CardTitle>
                <button className="text-white/80 hover:text-white">
                  <Settings className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded bg-red-500" />
                    <div className="w-6 h-6 rounded bg-yellow-500" />
                  </div>
                  <div>
                    <p className="font-semibold">Master Card</p>
                    <p className="text-sm text-white/80">**** **** **** 4002</p>
                  </div>
                </div>
                <p className="text-sm text-white/80">Expiry on 20/2027</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Modals */}
      <ReceiptModal transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />

      {showCancelModal && (
        <CancelSubscriptionModal
          variant="confirm"
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleCancelClick}
        />
      )}

      {showCancelInfo && (
        <CancelSubscriptionModal
          variant="info"
          onClose={() => setShowCancelInfo(false)}
          onConfirm={() => setShowCancelInfo(false)}
        />
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "@/components/ui"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui"
import { Badge } from "@/components/ui/badge"
import { Star, MessageCircle, ThumbsUp, ThumbsDown } from "lucide-react"

interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
  status: "pending" | "published" | "hidden"
  helpful: number
  unhelpful: number
}

export function ReviewManagementPage() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      rating: 5,
      comment: "Excellent service! The team was professional and attentive to every detail.",
      date: "2 weeks ago",
      status: "published",
      helpful: 24,
      unhelpful: 2,
    },
    {
      id: "2",
      author: "Michael Chen",
      rating: 4,
      comment: "Great experience overall. Minor delays but excellent quality.",
      date: "1 month ago",
      status: "published",
      helpful: 18,
      unhelpful: 1,
    },
    {
      id: "3",
      author: "Emily Davis",
      rating: 5,
      comment: "Outstanding! Would highly recommend to anyone.",
      date: "5 days ago",
      status: "pending",
      helpful: 0,
      unhelpful: 0,
    },
  ])

  const [activeTab, setActiveTab] = useState("published")

  const getFilteredReviews = (status: string) => {
    return reviews.filter((r) => r.status === status)
  }

  const handlePublish = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "published" as const } : r)))
  }

  const handleHide = (id: string) => {
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "hidden" as const } : r)))
  }

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Review Management</h1>
          <p className="text-muted-foreground">Manage and respond to customer reviews</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviews.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Rating</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold">
                  {(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)}
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {reviews.filter((r) => r.status === "pending").length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="published">Published ({getFilteredReviews("published").length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({getFilteredReviews("pending").length})</TabsTrigger>
            <TabsTrigger value="hidden">Hidden ({getFilteredReviews("hidden").length})</TabsTrigger>
          </TabsList>

          {/* Published Reviews */}
          <TabsContent value="published" className="space-y-4">
            {getFilteredReviews("published").map((review) => (
              <ReviewCard key={review.id} review={review} onHide={() => handleHide(review.id)} />
            ))}
          </TabsContent>

          {/* Pending Reviews */}
          <TabsContent value="pending" className="space-y-4">
            {getFilteredReviews("pending").map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.author}</span>
                        <Badge variant="outline" className="bg-orange-50 border-orange-200 text-orange-700">
                          Pending Review
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-sm">{review.comment}</p>

                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      className="bg-primary text-white hover:bg-primary/90"
                      onClick={() => handlePublish(review.id)}
                    >
                      Publish
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleHide(review.id)}>
                      Hide
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Hidden Reviews */}
          <TabsContent value="hidden" className="space-y-4">
            {getFilteredReviews("hidden").map((review) => (
              <Card key={review.id} className="opacity-75">
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{review.author}</span>
                        <Badge variant="outline">Hidden</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground">{review.comment}</p>

                  <div className="flex gap-2 pt-4">
                    <Button
                      size="sm"
                      className="bg-primary text-white hover:bg-primary/90"
                      onClick={() => handlePublish(review.id)}
                    >
                      Publish
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function ReviewCard({
  review,
  onHide,
}: {
  review: Review
  onHide: () => void
}) {
  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{review.author}</span>
            </div>
            <p className="text-sm text-muted-foreground">{review.date}</p>
          </div>
        </div>

        <div className="flex gap-1">
          {[...Array(review.rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <p className="text-sm">{review.comment}</p>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Button variant="ghost" size="sm" className="gap-1 hover:text-primary">
            <ThumbsUp className="w-4 h-4" />
            {review.helpful}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 hover:text-destructive">
            <ThumbsDown className="w-4 h-4" />
            {review.unhelpful}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 hover:text-primary">
            <MessageCircle className="w-4 h-4" />
            Reply
          </Button>
        </div>

        <div className="flex gap-2 pt-4">
          <Button variant="outline" size="sm" onClick={onHide}>
            Hide Review
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import { Search, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import api from "../../lib/axios"

export function AdminSubscriptions() {
  const [searchQuery, setSearchQuery] = useState("")
  const [planFilter, setPlanFilter] = useState<string | null>(null)

  // Fetch subscriptions
  const { data: subscriptions, isLoading } = useQuery<Array<typeof mockSubscriptions[number]>>({
    queryKey: ["adminSubscriptions", searchQuery, planFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (planFilter) params.append("plan", planFilter)

      const response = await api.get(`/api/admin/subscriptions?${params.toString()}`)
      return response.data
    },
    // If the API endpoint doesn't exist yet, this will prevent errors
      // If the API endpoint doesn't exist yet, this will prevent errors
      retry: false,
  })

  // Mock data for demonstration
  const mockSubscriptions = [
    {
      _id: "1",
      plan: "pro",
      status: "active",
      billingCycle: "monthly",
      amount: 12,
      nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days from now
      user: {
        name: "Alex Johnson",
        email: "alex@example.com",
      },
    },
    {
      _id: "2",
      plan: "teams",
      status: "active",
      billingCycle: "annual",
      amount: 490,
      nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(), // 180 days from now
      user: {
        name: "Sarah Miller",
        email: "sarah@example.com",
      },
    },
    {
      _id: "3",
      plan: "pro",
      status: "canceled",
      billingCycle: "monthly",
      amount: 12,
      nextBillingDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
      user: {
        name: "David Chen",
        email: "david@example.com",
      },
    },
    {
      _id: "4",
      plan: "pro",
      status: "past_due",
      billingCycle: "monthly",
      amount: 12,
      nextBillingDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
      user: {
        name: "Emily Wilson",
        email: "emily@example.com",
      },
    },
  ]

  const displaySubscriptions = subscriptions || mockSubscriptions

  // Plans for filtering
  const plans = ["free", "pro", "teams"]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The query will be refetched automatically due to the dependency on searchQuery
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscriptions</CardTitle>
          <CardDescription>Manage user subscriptions and billing</CardDescription>
          <div className="mt-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
        <CardDescription>Manage user subscriptions and billing</CardDescription>
        <form onSubmit={handleSearch} className="mt-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder="Search by user..."
              value={searchQuery}
              onChange={(e: { target: { value: React.SetStateAction<string> } }) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <div className="flex flex-wrap gap-2 mt-4">
          {plans.map((plan) => (
            <Badge
              key={plan}
              variant={planFilter === plan ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setPlanFilter(planFilter === plan ? null : plan)}
            >
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displaySubscriptions.length > 0 ? (
            displaySubscriptions.map((subscription: { _id: React.Key | null | undefined; user: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; email: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }; plan: string; status: string }) => (
              <div key={subscription._id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{subscription.user.name}</p>
                  <p className="text-sm text-muted-foreground">{subscription.user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      subscription.plan === "free" ? "outline" : subscription.plan === "pro" ? "default" : "secondary"
                    }
                  >
                    {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)}
                  </Badge>
                  <Badge
                    variant={
                      subscription.status === "active"
                        ? "default"
                        : subscription.status === "canceled"
                          ? "outline"
                          : "destructive"
                    }
                    className="hidden sm:inline-flex"
                  >
                    {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Subscription</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Cancel Subscription</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No subscriptions found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

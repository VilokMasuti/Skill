"use client"

import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { BarChart, Users, Award, CreditCard } from "lucide-react"
import api from "../../lib/axios"

export function AdminStats() {
  // Fetch admin stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const response = await api.get("/api/admin/stats")
      return response.data
    },
    // If the API endpoint doesn't exist yet, this will prevent errors
      // If the API endpoint doesn't exist yet, this will prevent errors
      retry: false,
  })

  // Mock data for demonstration
  const mockStats = {
    totalUsers: 1254,
    activeUsers: 876,
    totalSkills: 3421,
    premiumUsers: 342,
    monthlyRevenue: 4128,
    skillExchanges: 1876,
  }

  const displayStats = stats || mockStats

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayStats.totalUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">{displayStats.activeUsers.toLocaleString()} active users</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Skills</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayStats.totalSkills.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {(displayStats.totalSkills / displayStats.totalUsers).toFixed(1)} per user
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{displayStats.premiumUsers.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            {((displayStats.premiumUsers / displayStats.totalUsers) * 100).toFixed(1)}% conversion rate
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${displayStats.monthlyRevenue.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            ${(displayStats.monthlyRevenue / displayStats.premiumUsers).toFixed(2)} per premium user
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

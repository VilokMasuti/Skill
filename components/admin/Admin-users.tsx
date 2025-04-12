/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import api from "../../lib/axios"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"
import { Button } from "../ui/button"
import { MoreHorizontal, Search } from "lucide-react"
import { Input } from "../ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"

export function AdminUsers(){
  const [searchQuery, setSerchQuery] = useState("")
  // Fetch users
  const { data: users, isLoading } = useQuery({
    queryKey: ["adminUsers", searchQuery],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)

      const response = await api.get(`/api/admin/users?${params.toString()}`)
      return response.data
    },
    // If the API endpoint doesn't exist yet, this will prevent errors
    retry: false,
  })

  // Mock data for demonstration
  const mockUsers = [
    {
      _id: "1",
      name: "Alex Johnson",
      email: "alex@example.com",
      plan: "pro",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(), // 30 days ago
      image: "/placeholder.svg?height=40&width=40",
      initials: "AJ",
    },
    {
      _id: "2",
      name: "Sarah Miller",
      email: "sarah@example.com",
      plan: "free",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60).toISOString(), // 60 days ago
      image: "/placeholder.svg?height=40&width=40",
      initials: "SM",
    },
    {
      _id: "3",
      name: "David Chen",
      email: "david@example.com",
      plan: "teams",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90).toISOString(), // 90 days ago
      image: "/placeholder.svg?height=40&width=40",
      initials: "DC",
    },
    {
      _id: "4",
      name: "Emily Wilson",
      email: "emily@example.com",
      plan: "pro",
      status: "inactive",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(), // 120 days ago
      image: "/placeholder.svg?height=40&width=40",
      initials: "EW",
    },
  ]

  const displayUsers = users || mockUsers

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The query will be refetched automatically due to the dependency on searchQuery
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage your platform users</CardDescription>
          <div className="mt-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24 mt-1" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
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
        <CardTitle>Users</CardTitle>
        <CardDescription>Manage your platform users</CardDescription>
        <form onSubmit={handleSearch} className="mt-4">
          <div className="flex w-full items-center space-x-2">
            <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSerchQuery(e.target.value)} />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayUsers.length > 0 ? (
            displayUsers.map((user: { _id: React.Key | null | undefined; image: any; name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; initials: any; email: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; plan: string; status: string }) => (
              <div key={user._id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="mr-3">
                    <AvatarImage src={user.image} alt={String(user.name) || "User"} />
                    <AvatarFallback>{user.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.plan === "free" ? "outline" : user.plan === "pro" ? "default" : "secondary"}>
                    {user.plan.charAt(0).toUpperCase() + user.plan.slice(1)}
                  </Badge>
                  <Badge
                    variant={user.status === "active" ? "default" : "destructive"}
                    className="hidden sm:inline-flex"
                  >
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
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
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Suspend User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No users found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

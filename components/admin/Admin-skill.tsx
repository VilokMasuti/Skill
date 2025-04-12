/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Search, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import api from "../../lib/axios"
import { Skeleton } from "../ui/skeleton"

export function AdminSkills() {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null)

  // Fetch skills
  const { data: skills, isLoading } = useQuery({
    queryKey: ["adminSkills", searchQuery, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (searchQuery) params.append("search", searchQuery)
      if (categoryFilter) params.append("category", categoryFilter)

      const response = await api.get(`/api/admin/skills?${params.toString()}`)
      return response.data
    },
     // If the API endpoint doesn't exist yet, this will prevent errors
      // If the API endpoint doesn't exist yet, this will prevent errors
      retry: false,
  })

  // Mock data for demonstration
  const mockSkills = [
    {
      _id: "1",
      title: "Full-Stack Web Development",
      category: "Development",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
      user: {
        name: "Alex Johnson",
        email: "alex@example.com",
      },
    },
    {
      _id: "2",
      title: "Logo & Brand Identity Design",
      category: "Design",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), // 10 days ago
      user: {
        name: "Sarah Miller",
        email: "sarah@example.com",
      },
    },
    {
      _id: "3",
      title: "SEO Optimization",
      category: "Marketing",
      status: "active",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15).toISOString(), // 15 days ago
      user: {
        name: "David Chen",
        email: "david@example.com",
      },
    },
    {
      _id: "4",
      title: "Content Writing",
      category: "Writing",
      status: "inactive",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20).toISOString(), // 20 days ago
      user: {
        name: "Emily Wilson",
        email: "emily@example.com",
      },
    },
  ]

  const displaySkills = skills || mockSkills

  // Categories for filtering
  const categories = ["Development", "Design", "Marketing", "Writing", "Video", "Audio", "Business", "Education"]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The query will be refetched automatically due to the dependency on searchQuery
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Manage skills listed on the platform</CardDescription>
          <div className="mt-4">
            <Skeleton className="h-10 w-full" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32 mt-1" />
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
        <CardTitle>Skills</CardTitle>
        <CardDescription>Manage skills listed on the platform</CardDescription>
        <form onSubmit={handleSearch} className="mt-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>
        <div className="flex flex-wrap gap-2 mt-4">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={categoryFilter === category ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setCategoryFilter(categoryFilter === category ? null : category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displaySkills.length > 0 ? (
            displaySkills.map((skill: { _id: React.Key | null | undefined; title: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; user: { name: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined }; createdAt: string | number | Date; category: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined; status: string }) => (
              <div key={skill._id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{skill.title}</p>
                  <p className="text-sm text-muted-foreground">
                    By {skill.user.name} • {formatDistanceToNow(new Date(skill.createdAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{skill.category}</Badge>
                  <Badge
                    variant={skill.status === "active" ? "default" : "destructive"}
                    className="hidden sm:inline-flex"
                  >
                    {skill.status.charAt(0).toUpperCase() + skill.status.slice(1)}
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
                      <DropdownMenuItem>View Skill</DropdownMenuItem>
                      <DropdownMenuItem>Edit Skill</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Remove Skill</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No skills found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useQuery,  } from "@tanstack/react-query"

import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from '../ui/card';

;
import { Plus } from "lucide-react"
import Link from "next/link"

import { toast } from "sonner"
import { motion } from "framer-motion"
import { getSession } from "../../lib/auth"
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

/**
 * Fetch user skills from the API
 */
async function getUserSkills(userId: string) {
  const response = await fetch(`/api/users/${userId}/skills`)
  if (!response.ok) {
    throw new Error("Failed to fetch skills")
  }
  return response.json()
}

/**
 * User skills component with Apple-inspired design
 */
export function UserSkills() {
  const   session  = getSession()


  // Fetch user skills with React Query
  const {
    data: skills,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userSkills", session],
    queryFn: () => getUserSkills(session as unknown as string),
    enabled: !!session
  })

  if (isLoading) {
    return (
      <Card className="border-opacity-50">
        <CardHeader>
          <CardTitle>My Skills</CardTitle>
          <CardDescription>Skills you can offer to others</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    toast.error("Failed to load skills. Please try again.")

    return (
      <Card>
        <CardHeader>
          <CardTitle>My Skills</CardTitle>
          <CardDescription>Skills you can offer to others</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Error loading skills. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-opacity-50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-muted/30">
        <div className="space-y-1">
          <CardTitle>My Skills</CardTitle>
          <CardDescription>Skills you can offer to others</CardDescription>
        </div>
        <Button size="sm" asChild className="rounded-full">
          <Link href="/skills/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {skills?.length > 0 ? (
          <div className="divide-y">
            {skills.map((skill: any, index: number) => (
              <motion.div
                key={skill._id}
                className="p-4 hover:bg-muted/30 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">{skill.title}</h3>
                  <Badge variant="outline" className="rounded-full px-2.5 py-0.5 text-xs font-medium">
                    {skill.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{skill.description}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4">
            <p className="text-sm text-muted-foreground mb-4">You haven&apos;t added any skills yet</p>
            <Button asChild className="rounded-full">
              <Link href="/skills/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Skill
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

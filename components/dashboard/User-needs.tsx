/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import {  useQuery } from '@tanstack/react-query';

import {
  Card,
  CardContent,
  CardDescription,

  CardHeader,
  CardTitle,
} from '../ui/card';

import api from '../../lib/axios';

import {  Edit, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../ui/button';


import { getSession } from '../../lib/auth';
import { Skeleton } from '../ui/skeleton';
import Link from 'next/link';
import { motion } from "framer-motion"

/**
 * Fetch user needs from the API
 */
async function getUserNeeds(userId: string) {
  const response = await api.get(`/api/users/${userId}/needs`)
  if (!response) {
    throw new Error("Failed to fetch needs")
  }
  return response.data
}

/**
 * User needs component with Apple-inspired design
 */
export function UserNeeds() {
  const   session  = getSession()

  // Fetch user needs with React Query
  const {
    data: needs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userNeeds", session],
    queryFn: () => getUserNeeds(session as unknown as string),
    enabled: !!session
  })

  if (isLoading) {
    return (
      <Card className="border-opacity-50">
        <CardHeader>
          <CardTitle>My Needs</CardTitle>
          <CardDescription>Skills you&apos;re looking to learn or get help with</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    toast.error("Failed to load needs. Please try again.")

    return (
      <Card>
        <CardHeader>
          <CardTitle>My Needs</CardTitle>
          <CardDescription>Skills you&apos;re looking to learn or get help with</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">Error loading needs. Please try again.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-opacity-50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 bg-muted/30">
        <div className="space-y-1">
          <CardTitle>My Needs</CardTitle>
          <CardDescription>Skills you&apos;re looking to learn or get help with</CardDescription>
        </div>
        <Button size="sm" variant="outline" asChild className="rounded-full">
          <Link href="/profile/edit">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {needs?.length > 0 ? (
          <div className="divide-y">
            {needs.map((need: string, index: number) => (
              <motion.div
                key={index}
                className="p-4 hover:bg-muted/30 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <p className="text-sm">{need}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center p-4">
            <p className="text-sm text-muted-foreground mb-4">You haven&apos;t added any needs yet</p>
            <Button variant="outline" asChild className="rounded-full">
              <Link href="/profile/edit">
                <Plus className="mr-2 h-4 w-4" />
                Add Skills You Need
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

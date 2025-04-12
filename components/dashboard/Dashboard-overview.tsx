'use client';
import { ArrowUpRight, Award, BarChart3, Brain, Users } from 'lucide-react';
import Link from 'next/link';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Skeleton } from '../ui/skeleton';

import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';

interface DashboardOverviewProps {
  userId: string
}

export function DashboardOverview({ userId }: DashboardOverviewProps) {
  // Fetch user profile with stats
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const response = await api.get(`/api/users/${userId}`)
      return response.data
    },
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Mock data for demonstration
  const profileCompleteness = 75
  const activeExchanges = 2
  const completedExchanges = 8
  const reputation = 4.7

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Overview</CardTitle>
        <CardDescription>Your current status and activity on SkillSwap</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Profile Completeness</span>
              <span className="text-sm font-medium">{profileCompleteness}%</span>
            </div>
            <Progress value={profileCompleteness} className="h-2" />
            <Button asChild variant="ghost" size="sm" className="mt-2 w-full justify-between">
              <Link href="/profile/edit">
                Complete Profile <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{activeExchanges}</div>
              <div className="text-sm text-muted-foreground">Active Exchanges</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{completedExchanges}</div>
              <div className="text-sm text-muted-foreground">Completed Exchanges</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{reputation}</div>
              <div className="text-sm text-muted-foreground">Reputation Score</div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            asChild
            className="rounded-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md"
          >
            <Link href="/dashboard/skill-assessment">
              <Brain className="mr-2 h-5 w-5" />
              Get AI Skill Assessment
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

'use client';

import { useQuery } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowUpRight,
  MessageSquare,
  Star,
  TrendingUp,
  Users,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import api from '../../lib/axios';
interface DashboardStatsProps {
  userId: string;
}

export function DashboardStats({ userId }: DashboardStatsProps) {
  // Fetch user stats
  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats', userId],
    queryFn: async () => {
      const response = await api.get(`/api/users/${userId}/stats`);
      return response.data;
    },
  });

  // Mock data for demonstration
  const statCards = [
    {
      title: 'Total Skills',
      value: stats?.skillsCount || 0,
      change: '+14%',
      trend: 'up',
      icon: <TrendingUp className="h-4 w-4 text-green-500" />,
    },
    {
      title: 'Active Matches',
      value: stats?.matchesCount || 0,
      change: '+5%',
      trend: 'up',
      icon: <Users className="h-4 w-4 text-green-500" />,
    },
    {
      title: 'Messages',
      value: stats?.messagesCount || 0,
      change: '+32%',
      trend: 'up',
      icon: <MessageSquare className="h-4 w-4 text-green-500" />,
    },
    {
      title: 'Rating',
      value: stats?.rating?.average || 0,
      subtext: `(${stats?.rating?.count || 0} reviews)`,
      change: '-2%',
      trend: 'down',
      icon: <Star className="h-4 w-4 text-amber-500" />,
    },
  ];

  if (isLoading) {
    return (
      <>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {statCards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-2xl font-bold">
                {card.title === 'Rating' ? card.value.toFixed(1) : card.value}
                {card.subtext && (
                  <span className="text-xs text-muted-foreground ml-1">
                    {card.subtext}
                  </span>
                )}
              </div>
              <div className="flex items-center text-xs">
                <span
                  className={
                    card.trend === 'up' ? 'text-green-500' : 'text-red-500'
                  }
                >
                  {card.change}
                </span>
                {card.trend === 'up' ? (
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="ml-1 h-3 w-3" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}

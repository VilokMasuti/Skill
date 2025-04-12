'use client';

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

import { BookOpen, MessageSquare, Star } from 'lucide-react';
import { useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import { Skeleton } from '../ui/skeleton';

/**
 * Fetch user stats from the API
 */
async function getUserStats(userId: string) {
  const response = await fetch(`/api/users/${userId}/stats`);
  if (!response.ok) {
    throw new Error('Failed to fetch user stats');
  }
  return response.json();
}

/**
 * User stats component with Apple-inspired design
 */
export function UserStats() {
  const { data: session } = useSession();

  // Fetch user stats with React Query
  const { data: stats, isLoading } = useQuery({
    queryKey: ['userStats', session?.user?.id],
    queryFn: () => getUserStats(session?.user?.id as string),
    enabled: !!session?.user?.id,
    // Fallback data for initial render
    placeholderData: {
      skillsCount: 0,
      messagesCount: 0,
      rating: { average: 0, count: 0 },
    },
  });

  if (isLoading) {
    return (
      <>
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border-opacity-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-7 w-12" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  const statCards = [
    {
      title: 'Skills Offered',
      value: stats.skillsCount,
      icon: <BookOpen className="h-5 w-5 text-primary" />,
      color: 'from-blue-500/20 to-blue-600/20',
    },
    {
      title: 'Messages',
      value: stats.messagesCount,
      icon: <MessageSquare className="h-5 w-5 text-primary" />,
      color: 'from-indigo-500/20 to-indigo-600/20',
    },
    {
      title: 'Rating',
      value: stats.rating.average > 0 ? stats.rating.average.toFixed(1) : 'N/A',
      subtext:
        stats.rating.count > 0 ? `(${stats.rating.count} reviews)` : null,
      icon: <Star className="h-5 w-5 text-primary" />,
      color: 'from-purple-500/20 to-purple-600/20',
    },
  ];

  return (
    <>
      {statCards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="overflow-hidden border-opacity-50">
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-30 z-0`}
            ></div>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="flex items-baseline space-x-2">
                <div className="text-2xl font-bold">{card.value}</div>
                {card.subtext && (
                  <div className="text-xs text-muted-foreground">
                    {card.subtext}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </>
  );
}

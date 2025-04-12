/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import api from '../../lib/axios';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Skeleton } from '../ui/skeleton';

interface DashboardActivityProps {
  userId: string;
}
export function DashboardActivity({ userId }: DashboardActivityProps) {
  // Fetch user activity
  const { data: activity, isLoading } = useQuery({
    queryKey: ['userActivity', userId],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/users/${userId}/activity`);
        return response.data;
      } catch (error) {
        // If the API endpoint doesn't exist yet, this will prevent errors
        return [];
      }
    },
  });

  // Mock data for demonstration
  const mockActivity = [
    {
      _id: '1',
      type: 'match',
      title: 'New Match',
      description: 'You matched with Sarah Miller for Graphic Design',
      user: {
        name: 'Sarah Miller',
        image: '/placeholder.svg?height=40&width=40',
        initials: 'SM',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
    },
    {
      _id: '2',
      type: 'message',
      title: 'New Message',
      description: 'Alex Johnson sent you a message about Web Development',
      user: {
        name: 'Alex Johnson',
        image: '/placeholder.svg?height=40&width=40',
        initials: 'AJ',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    },
    {
      _id: '3',
      type: 'review',
      title: 'New Review',
      description: 'David Chen gave you a 5-star review for Marketing help',
      user: {
        name: 'David Chen',
        image: '/placeholder.svg?height=40&width=40',
        initials: 'DC',
      },
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    },
    {
      _id: '4',
      type: 'skill',
      title: 'Skill Added',
      description: 'You added a new skill: Content Writing',
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
    },
  ];
  const displayActivity =
    activity && activity.length > 0 ? activity : mockActivity;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex">
                <Skeleton className="h-10 w-10 rounded-full mr-4" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-20 mt-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest interactions and updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {displayActivity.map((item: any) => (
            <div key={item._id} className="flex">
              {item.user ? (
                <Avatar className="mr-4">
                  <AvatarImage src={item.user.image} alt={item.user.name} />
                  <AvatarFallback>{item.user.initials}</AvatarFallback>
                </Avatar>
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                  <span className="text-primary text-xs font-medium">You</span>
                </div>
              )}
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {formatDistanceToNow(new Date(item.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

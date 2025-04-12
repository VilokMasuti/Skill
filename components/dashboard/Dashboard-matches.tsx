'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Skeleton } from '../ui/skeleton';

import { Search } from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/axios';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';

interface DashboardMatchesProps {
  userId: string;
}

export function DashboardMatches({ userId }: DashboardMatchesProps) {
  // Fetch user matches
  const { data: matches, isLoading } = useQuery({
    queryKey: ['userMatches', userId],
    queryFn: async () => {
      try {
        const response = await api.get(`/api/users/${userId}/matches`);
        return response.data;
      } catch (error) {
        console.error('Error fetching matches:', error);
        return [];
      }
    },
  });
  // Mock data for demonstration
  const mockMatches = [
    {
      _id: '1',
      name: 'Alex Johnson',
      skill: 'Web Development',
      matchScore: 95,
      image: '/placeholder.svg?height=40&width=40',
      initials: 'AJ',
    },
    {
      _id: '2',
      name: 'Sarah Miller',
      skill: 'Graphic Design',
      matchScore: 87,
      image: '/placeholder.svg?height=40&width=40',
      initials: 'SM',
    },
    {
      _id: '3',
      name: 'David Chen',
      skill: 'Marketing',
      matchScore: 82,
      image: '/placeholder.svg?height=40&width=40',
      initials: 'DC',
    },
  ];

  const displayMatches = matches && matches.length > 0 ? matches : mockMatches;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48 mt-1" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="h-10 w-10 rounded-full mr-3" />
                  <div>
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </div>
                </div>
                <Skeleton className="h-8 w-16" />
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Skill Matches</CardTitle>
            <CardDescription>People who match your skill needs</CardDescription>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href="/matches">
              <Search className="mr-2 h-4 w-4" />
              Find Matches
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {displayMatches && displayMatches.length > 0 ? (
          <div className="space-y-4">
            {displayMatches.slice(0, 3).map((match: any) => (
              <div
                key={match._id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center">
                  <Avatar className="mr-3">
                    <AvatarImage src={match.image} alt={match.name} />
                    <AvatarFallback>{match.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{match.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {match.skill}
                    </p>
                  </div>
                </div>
                <div className="text-sm font-medium">
                  <span className="text-green-500">{match.matchScore}%</span>{' '}
                  match
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">No matches found yet</p>
            <Button asChild>
              <Link href="/matches">Find Matches</Link>
            </Button>
          </div>
        )}
      </CardContent>
      {displayMatches && displayMatches.length > 3 && (
        <CardFooter>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/matches">View All Matches</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

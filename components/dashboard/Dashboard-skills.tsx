/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Skeleton } from '../ui/skeleton';

import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
} from 'react';
import api from '../../lib/axios';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface DashboardSkillsProps {
  userId: string;
}

export function DashboardSkills({ userId }: DashboardSkillsProps) {
  // Fetch user skills
  const { data: skills, isLoading } = useQuery({
    queryKey: ['userSkills', userId],
    queryFn: async () => {
      const response = await api.get(`/api/users/${userId}/skills`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-4 w-40 mt-1" />
            </div>
            <Skeleton className="h-9 w-24" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center">
                <div>
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
                <Skeleton className="h-6 w-16" />
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
            <CardTitle>My Skills</CardTitle>
            <CardDescription>Skills you can offer to others</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href="/skills/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Skill
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {skills && skills.length > 0 ? (
          <div className="space-y-4">
            {skills
              .slice(0, 5)
              .map(
                (skill: {
                  _id: Key | null | undefined;
                  title:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  category:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                  contactPreference:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | null
                    | undefined;
                }) => (
                  <div
                    key={skill._id}
                    className="flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{skill.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {skill.category}
                      </p>
                    </div>
                    <Badge variant="outline">{skill.contactPreference}</Badge>
                  </div>
                )
              )}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t added any skills yet
            </p>
            <Button asChild>
              <Link href="/skills/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Skill
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
      {skills && skills.length > 5 && (
        <CardFooter>
          <Button asChild variant="ghost" className="w-full">
            <Link href="/dashboard/skills">View All Skills</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

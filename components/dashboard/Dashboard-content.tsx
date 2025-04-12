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

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import api from '../../lib/axios';
import { Button } from '../ui/button';

interface DashboardContentProps {
  userId: string;
}

export function DashboardContent({ userId }: DashboardContentProps) {
  // Fetch user profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    },
  });

  // Fetch user skills
  const { data: skills, isLoading: skillsLoading } = useQuery({
    queryKey: ['skills', userId],
    queryFn: async () => {
      const response = await api.get(`/api/users/${userId}`);
      return response.data;
    },
  });
  if (profileLoading || skillsLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Your personal information and skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile ? (
            <div className="space-y-4">
              <div>
                <p className="font-medium">{profile.name}</p>
                <p className="text-muted-foreground">{profile.email}</p>
                {profile.bio && <p className="mt-2">{profile.bio}</p>}
              </div>
              {profile.github && (
                <div>
                  <p className="text-sm font-medium">GitHub:</p>
                  <a
                    href={`https://github.com/${profile.github}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {profile.github}
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">Profile not found</p>
          )}
        </CardContent>
        <CardFooter>
          <Button asChild variant="outline">
            <Link href="/profile/edit">Edit Profile</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Skills you offer to others</CardDescription>
        </CardHeader>
        <CardContent>
          {skills && skills.length > 0 ? (
            <ul className="space-y-2">
              {skills.map((skill: any) => (
                <li key={skill._id}>
                  <p className="font-medium">{skill.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {skill.category}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">No skills added yet</p>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="outline">
            <Link href="/skills/new">Add Skill</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>AI Skill Matching</CardTitle>
          <CardDescription>
            Find people who match your skills and needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Our free AI matching algorithm analyzes your skills and needs to
            find the perfect exchange partners. Connect with professionals who
            have the skills you need and need the skills you have.
          </p>
        </CardContent>
        <CardFooter>
          <Button asChild>
            <Link href="/matches">
              Find Matches <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

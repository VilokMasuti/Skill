'use client';

import type React from 'react';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/use-auth';
import { Button } from '../ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export function SignInForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn } = useAuth();
  // const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await signIn(email, password);

      if (result.success) {
        toast.success('Signed in successfully');
        router.push('/dashboard');
        // Redirect to the callback URL if provided
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to sign in');
      }
    } catch (error) {
      console.error('Error signing in:', error);
      toast.error('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className=" w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-heading font-bold text-center">
          Sign In
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to SkillSwap to start exchanging skills
        </CardDescription>
      </CardHeader>
      <CardContent className=" space-y-6">
        {error && (
          <div className="p-3 rounded-md bg-destructive/10 text-destructive text-center text-sm">
            {error === 'CredentialsSignin' && 'Invalid email or password.'}
            {error === 'SessionRequired' &&
              'Please sign in to access this page.'}
            {!['CredentialsSignin', 'SessionRequired'].includes(error) &&
              'An error occurred during sign in.'}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col items-center space-y-2">
        <div className="text-sm text-center">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
        <p className="text-xs text-muted-foreground text-center">
          By signing in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
}

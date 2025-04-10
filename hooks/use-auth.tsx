/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, type ReactNode } from 'react';

import { toast } from 'sonner';
import api from '../lib/axios';

// User type
export type User = {
  userId: string
  name: string
  email: string
  image?: string
}

// Auth context type
type AuthContextType = {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (name: string, email: string, password: string) => Promise<{
    [x: string]: any; success: boolean; error?: string
}>
  signOut: () => Promise<void>
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth provider props
type AuthProviderProps = {
  children: ReactNode
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const queryClient = useQueryClient()

  // Fetch session data
  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      try {
        const response = await api.get("/api/auth/session")
        return response.data.user
      } catch (error) {
        console.error("Error fetching session:", error)
        return null
      }
    },
  })

  // Sign in mutation
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await api.post("/api/auth/signin", { email, password })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] })
    },
  })

  // Sign up mutation
  const signUpMutation = useMutation({
    mutationFn: async ({ name, email, password }: { name: string; email: string; password: string }) => {
      const response = await api.post("/api/auth/signup", { name, email, password })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] })
    },
  })

  // Sign out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/api/auth/signout")
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["session"] })
      router.push("/")
      router.refresh()
      toast.success("Signed out successfully")
    },
    onError: () => {
      toast.error("Failed to sign out")
    },
  })

  // Sign in function
  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await signInMutation.mutateAsync({ email, password })
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to sign in"
      return { success: false, error: errorMessage }
    }
  }

  // Sign up function
  const signUp = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      await signUpMutation.mutateAsync({ name, email, password })
      return { success: true }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || "Failed to sign up"
      return { success: false, error: errorMessage }
    }
  }

  // Sign out function
  const signOut = async (): Promise<void> => {
    await signOutMutation.mutateAsync()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }

  return context
}

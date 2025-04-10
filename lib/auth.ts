/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import bcrypt from "bcryptjs"
import { redirect } from "next/navigation"
import { User } from "./models/user"
import { connectToDatabase } from "./mongodb"

// Secret key used to sign/verify JWT tokens
const secretKey = process.env.JWT_SECRET || "your-secret-key-at-least-32-chars-long"
const key = new TextEncoder().encode(secretKey)

// Token expiry time (24 hours)
const SESSION_EXPIRY = 60 * 60 * 24

// Cookie name for the session
export const SESSION_COOKIE = "skillswap_session"

// Session data type
export type SessionData = {
  userId: string
  email: string
  name: string
  image?: string
  exp: number
}

/**
 * Create a new session for a user
 */
export async function createSession(user: any): Promise<string> {
  // Create session data
  const sessionData: Omit<SessionData, "exp"> = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    image: user.image,
  }

  // Create JWT token
  const token = await new SignJWT(sessionData)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_EXPIRY}s`)
    .sign(key)

  return token
}

/**
 * Set session cookie
 */
export async function setSessionCookie(token: string): Promise<void> {
  (await cookies()).set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY,
  })
}

/**
 * Get current session
 */
export async function getSession(): Promise<SessionData | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value

  if (!token) {
    return null
  }

  try {
    const { payload } = await jwtVerify(token, key)
    return payload as SessionData
  } catch (error) {
    // Token is invalid or expired
    return null
  }
}

/**
 * Clear session cookie
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

/**
 * Require authentication
 * Redirects to sign-in page if user is not authenticated
 */
export async function requireAuth(redirectTo = "/signin"): Promise<SessionData> {
  const session = await getSession()

  if (!session) {
    const callbackUrl = encodeURIComponent(redirectTo)
    redirect(`/signin?callbackUrl=${callbackUrl}`)
  }

  return session
}

/**
 * Sign in with email and password
 */
export async function signInWithCredentials(
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    await connectToDatabase()

    // Find user by email
    const user = await User.findOne({ email })

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    // Check if password exists
    if (!user.password) {
      console.error("User has no password stored")
      return { success: false, error: "Account setup incomplete. Please reset your password." }
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return { success: false, error: "Invalid email or password" }
    }

    // Create session
    const token = await createSession(user)
    await setSessionCookie(token)

    return { success: true }
  } catch (error) {
    console.error("Error signing in:", error)
    return { success: false, error: "An error occurred during sign in" }
  }
}

/**
 * Sign up with email and password
 */
export async function signUp(
  name: string,
  email: string,
  password: string,
): Promise<{ success: boolean; error?: string; isNewUser?: boolean }> {
  try {
    await connectToDatabase()

    // Check if user already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return { success: false, error: "Email already in use" }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user with password
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // Make sure password is included
      skills: [],
      needs: [],
      createdAt: new Date(),
    })

    // Save the user
    await newUser.save()

    // Create session
    const token = await createSession(newUser)
    await setSessionCookie(token)

    return { success: true, isNewUser: true }
  } catch (error) {
    console.error("Error signing up:", error)
    return { success: false, error: "An error occurred during sign up" }
  }
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  await clearSessionCookie()
}

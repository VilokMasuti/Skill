/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "../../../../../lib/auth"
import { connectToDatabase } from "../../../../../lib/mongodb"
import { User } from "../../../../../lib/models/user"


/**
 * GET handler for fetching a user's needs
 * Requires authentication and authorization (user can only view their own needs)
 */
export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session =   await getSession()


    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.userId

    // Only allow users to view their own profile or admins
    if (session.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user.needs || [])
  } catch (error) {
    console.error("Error fetching user needs:", error)
    return NextResponse.json({ error: "Failed to fetch user needs" }, { status: 500 })
  }
}

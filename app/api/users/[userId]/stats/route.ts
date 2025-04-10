/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "../../../../../lib/mongodb"
import { Skill } from "../../../../../lib/models/skill"
import { Message } from "../../../../../lib/models/message"
import { User } from "../../../../../lib/models/user"
import { getSession } from "../../../../../lib/auth"


/**
 * GET handler for fetching a user's stats
 * Requires authentication and authorization (user can only view their own stats)
 */
 async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
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

    // Get skills count
    const skillsCount = await Skill.countDocuments({ user: userId })

    // Get messages count
    const messagesCount = await Message.countDocuments({
      $or: [{ sender: userId }, { recipient: userId }],
    })

    // Get user rating
    const user = await User.findById(userId)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      skillsCount,
      messagesCount,
      rating: user.rating || { average: 0, count: 0 },
    })
  } catch (error) {
    console.error("Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}

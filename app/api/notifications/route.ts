
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "../../../lib/auth"
import { connectToDatabase } from "../../../lib/mongodb"
import { Notification } from "../../../lib/models/notification"

// Input validation schema for GET requests
const GetNotificationsSchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  page: z.coerce.number().min(1).optional().default(1),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse and validate query parameters
    const searchParams = request.nextUrl.searchParams
    const validatedQuery = GetNotificationsSchema.safeParse({
      limit: searchParams.get("limit"),
      page: searchParams.get("page"),
    })

    if (!validatedQuery.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: validatedQuery.error.format() },
        { status: 400 },
      )
    }

    const { limit, page } = validatedQuery.data

    await connectToDatabase()

    // Calculate pagination
    const skip = (page - 1) * limit

    // Get notifications
    const notifications = await Notification.find({ user: session.userId })
      .populate("relatedUser", "name image")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    // Get total count for pagination
    const total = await Notification.countDocuments({ user: session.userId })

    // Get unread count
    const unreadCount = await Notification.countDocuments({ user: session.userId, read: false })

    return NextResponse.json({
      notifications,
      unreadCount,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch notifications",
        message: "An unexpected error occurred while fetching notifications. Please try again later.",
      },
      { status: 500 },
    )
  }
}

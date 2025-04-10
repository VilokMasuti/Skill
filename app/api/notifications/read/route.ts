import { type NextRequest, NextResponse } from "next/server"

import { z } from "zod"
import { getSession } from "../../../../lib/auth"
import { connectToDatabase } from "../../../../lib/mongodb"
import { Notification } from "../../../../lib/models/notification"

// Input validation schema
const MarkReadSchema = z.object({
  ids: z.array(z.string()).optional(),
  all: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = MarkReadSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({ error: "Validation failed", details: validatedData.error.format() }, { status: 400 })
    }

    const { ids, all } = validatedData.data

    if (all) {
      // Mark all notifications as read
      await Notification.updateMany({ user: session.userId }, { $set: { read: true } })
    } else if (ids && ids.length > 0) {
      // Mark specific notifications as read
      await Notification.updateMany({ _id: { $in: ids }, user: session.userId }, { $set: { read: true } })
    } else {
      return NextResponse.json({ error: "Either 'ids' or 'all' must be provided" }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking notifications as read:", error)
    return NextResponse.json(
      {
        error: "Failed to mark notifications as read",
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 },
    )
  }
}

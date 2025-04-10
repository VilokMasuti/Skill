/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod"
import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "../../../lib/auth"
import { connectToDatabase } from "../../../lib/mongodb"
import { Message } from "../../../lib/models/message"
import { Notification } from "../../../lib/models/notification"
// Input validation schema for creating messages
const CreateMessageSchema = z.object({
  recipientId: z.string().min(1, "Recipient is required"),
  content: z.string().min(1, "Message content is required").max(1000, "Message is too long"),
})

// Input validation schema for GET requests
const GetMessagesSchema = z.object({
  userId: z.string().optional(),
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
  const validatedQuery = GetMessagesSchema.safeParse({
    userId: searchParams.get("userId"),
    limit: searchParams.get("limit"),
    page: searchParams.get("page"),
  })

  if (!validatedQuery.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: validatedQuery.error.format() },
      { status: 400 },
    )
  }

  const { userId, limit, page } = validatedQuery.data

  await connectToDatabase()


  const query: any = {
    $or: [{ sender: session.userId }, { recipient: session.userId }],
  }

  // If userId is provided, filter by conversation with that user
  if (userId) {
    query.$or = [
      { sender: session.userId, recipient: userId },
      { sender: userId, recipient: session.userId },
    ]
  }

  // Calculate pagination
  const skip = (page - 1) * limit

  // Get messages
  const messages = await Message.find(query)
    .populate("sender", "name image")
    .populate("recipient", "name image")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)

  // Get total count for pagination
  const total = await Message.countDocuments(query)

  return NextResponse.json({
    messages,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  })



  } catch (error) {
    console.error("Error fetching messages:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch messages",
        message: "An unexpected error occurred while fetching messages. Please try again later.",
      },
      { status: 500 },
    )
  }

}


export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = CreateMessageSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({ error: "Validation failed", details: validatedData.error.format() }, { status: 400 })
    }

    const { recipientId, content } = validatedData.data

    // Create new message
    const newMessage = new Message({
      sender: session.userId,
      recipient: recipientId,
      content,
      createdAt: new Date(),
    })

    await newMessage.save()

    // Create notification for recipient
    const notification = new Notification({
      user: recipientId,
      type: "message",
      title: "New Message",
      content: `You have a new message from ${session.name}`,
      relatedUser: session.userId,
      relatedMessage: newMessage._id,
      createdAt: new Date(),
    })

    await notification.save()

    return NextResponse.json(newMessage)
  } catch (error) {
    console.error("Error sending message:", error)
    return NextResponse.json(
      {
        error: "Failed to send message",
        message: "An unexpected error occurred while sending your message. Please try again later.",
      },
      { status: 500 },
    )
  }
}

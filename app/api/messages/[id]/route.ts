import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "../../../../lib/auth"
import { connectToDatabase } from "../../../../lib/mongodb"
import { Message } from "../../../../lib/models/message"
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const message = await Message.findById(params.id)
      .populate("sender", "name image")
      .populate("recipient", "name image")

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Check if user is authorized to view this message
    if (message.sender.toString() !== session.userId && message.recipient.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Mark as read if user is the recipient and message is unread
    if (message.recipient.toString() === session.userId && !message.read) {
      message.read = true
      await message.save()
    }

    return NextResponse.json(message)
  } catch (error) {
    console.error("Error fetching message:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch message",
        message: "An unexpected error occurred while fetching the message. Please try again later.",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await connectToDatabase()

    const message = await Message.findById(params.id)

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 })
    }

    // Check if user is authorized to delete this message
    if (message.sender.toString() !== session.userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await Message.findByIdAndDelete(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting message:", error)
    return NextResponse.json(
      {
        error: "Failed to delete message",
        message: "An unexpected error occurred while deleting the message. Please try again later.",
      },
      { status: 500 },
    )
  }
}

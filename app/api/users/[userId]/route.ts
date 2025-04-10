/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "../../../../lib/mongodb"
import { getSession } from "../../../../lib/auth"
import { z } from "zod"
import { User } from "../../../../lib/models/user"

// Input validation schema for profile updates
const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),
  location: z.string().max(100, "Location must not exceed 100 characters").optional(),
  github: z.string().max(100, "GitHub username must not exceed 100 characters").optional(),
  phone: z.string().max(20, "Phone number must not exceed 20 characters").optional(),
  needs: z.array(z.string().max(50, "Each need must not exceed 50 characters")).optional(),
})

 async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.userId

    // Only allow users to view their own profile or admins
    if (session.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    const user = await User.findById(userId).select("-password")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch user",
        message: "An unexpected error occurred while fetching user data. Please try again later.",
      },
      { status: 500 },
    )
  }
}

async function PATCH(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.userId

    // Only allow users to update their own profile
    if (session.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await connectToDatabase()

    // Parse and validate request body
    const body = await request.json()
    const validatedData = UpdateProfileSchema.safeParse(body)

    if (!validatedData.success) {
      return NextResponse.json({ error: "Validation failed", details: validatedData.error.format() }, { status: 400 })
    }

    const { name, bio, location, github, phone, needs } = validatedData.data

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          ...(name && { name }),
          ...(bio !== undefined && { bio }),
          ...(location !== undefined && { location }),
          ...(github !== undefined && { github }),
          ...(phone !== undefined && { phone }),
          ...(needs && { needs }),
        },
      },
      { new: true },
    ).select("-password")

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      {
        error: "Failed to update user",
        message: "An unexpected error occurred while updating your profile. Please try again later.",
      },
      { status: 500 },
    )
  }
}

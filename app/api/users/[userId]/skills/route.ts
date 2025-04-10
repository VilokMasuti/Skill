/* eslint-disable @typescript-eslint/no-unused-vars */
import { type NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "../../../../../lib/mongodb"
import { Skill } from "../../../../../lib/models/skill"
import { getSession } from "../../../../../lib/auth"
 async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = params.userId

    await connectToDatabase()

    const skills = await Skill.find({ user: userId }).sort({ createdAt: -1 })

    return NextResponse.json(skills)
  } catch (error) {
    console.error("Error fetching user skills:", error)
    return NextResponse.json({ error: "Failed to fetch user skills" }, { status: 500 })
  }
}

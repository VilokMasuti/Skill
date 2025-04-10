import { type NextRequest, NextResponse } from "next/server"
import { signUp } from "../../../../lib/auth" // Adjust the import path as necessary

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    const result = await signUp(name, email, password)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in signup route:", error)
    return NextResponse.json({ error: "An error occurred during sign up" }, { status: 500 })
  }
}

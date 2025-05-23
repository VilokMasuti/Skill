import { type NextRequest, NextResponse } from "next/server"
import { signInWithCredentials } from "../../../../lib/auth" 

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await signInWithCredentials(email, password)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in signin route:", error)
    return NextResponse.json({ error: "An error occurred during sign in" }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getSession } from "../../../../lib/auth"

export async function GET() {
  try {
    const session = await getSession()

    if(!session){
      return NextResponse.json({ error: "Session not found" }, { status: 404 })

    }
 return NextResponse.json({
      user: {
        userId: session.userId,
        name: session.name,
        email: session.email,
        image: session.image,
      },
    })


  } catch (error) {
    console.error("Error in session route:", error)
    return NextResponse.json({ error: "An error occurred while fetching session" }, { status: 500 })
  }
}

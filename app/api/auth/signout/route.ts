/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import { cookies } from "next/headers" // get cookies on the server

export async function POST() {
  try {
    const response = NextResponse.json({ success: true })

    // Clear the cookie manually
    response.cookies.set("skillswap_session", "", {
      httpOnly: true,
      expires: new Date(0), // expire immediately
    })

    return response
  } catch (error) {
    console.error("Error in signout route:", error)
    return NextResponse.json(
      { error: "An error occurred during sign out" },
      { status: 500 }
    )
  }
}

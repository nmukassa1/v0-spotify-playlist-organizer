import { auth, clerkClient } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET() {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const client = await clerkClient()
    const provider = "oauth_spotify"

    const clerkResponse = await client.users.getUserOauthAccessToken(userId, provider)
    const accessToken = clerkResponse.data[0]?.token

    if (!accessToken) {
      return NextResponse.json(
        { error: "No Spotify token found. Please reconnect your Spotify account." },
        { status: 404 }
      )
    }

    return NextResponse.json({ accessToken })
  } catch (error) {
    console.error("Failed to get Spotify OAuth token:", error)
    return NextResponse.json(
      { error: "Failed to retrieve Spotify access token" },
      { status: 500 }
    )
  }
}

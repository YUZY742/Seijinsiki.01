import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// GET /api/posts — list all visible posts, newest first
export async function GET() {
  try {
    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("hidden", false)
      .order("created_at", { ascending: false })
      .limit(500)

    if (error) {
      console.log("[v0] posts GET error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ posts: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.log("[v0] posts GET exception:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// POST /api/posts — record metadata for a freshly uploaded blob
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { url, pathname, contentType, sizeBytes, uploaderName, caption } = body ?? {}

    if (!url || !pathname || !contentType) {
      return NextResponse.json({ error: "url, pathname, contentType は必須です" }, { status: 400 })
    }

    const type: "photo" | "video" = String(contentType).startsWith("video/") ? "video" : "photo"

    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("posts")
      .insert({
        type,
        url,
        pathname,
        content_type: contentType,
        size_bytes: typeof sizeBytes === "number" ? sizeBytes : null,
        uploader_name: uploaderName ? String(uploaderName).slice(0, 60) : null,
        caption: caption ? String(caption).slice(0, 280) : null,
      })
      .select("*")
      .single()

    if (error) {
      console.log("[v0] posts POST error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.log("[v0] posts POST exception:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

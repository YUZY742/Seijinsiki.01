import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

// This is a more robust upload handler that receives the file on the server
// and then pushes it to Vercel Blob. This avoids client-side "hanging" issues.
const ALLOWED_PHOTO = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/gif"]
const ALLOWED_VIDEO = ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"]
const ALLOWED = [...ALLOWED_PHOTO, ...ALLOWED_VIDEO]

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    
    if (file && !ALLOWED.includes(file.type)) {
      return NextResponse.json({ error: "対応していないファイル形式です" }, { status: 400 })
    }
    const uploaderName = formData.get("uploaderName") as string
    const caption = formData.get("caption") as string

    if (!file) {
      return NextResponse.json({ error: "ファイルが見つかりません" }, { status: 400 })
    }

    console.log("[api/upload-server] Receiving file:", file.name, file.size)

    // 1. Upload to Vercel Blob from Server
    const blob = await put(file.name, file, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log("[api/upload-server] Blob upload success:", blob.url)

    // 2. Save to Supabase
    const type = file.type.startsWith("video/") ? "video" : "photo"
    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("posts")
      .insert({
        type,
        url: blob.url,
        pathname: blob.pathname,
        content_type: file.type,
        size_bytes: file.size,
        uploader_name: uploaderName || null,
        caption: caption || null,
      })
      .select("*")
      .single()

    if (error) {
      console.error("[api/upload-server] DB error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ post: data })
  } catch (error) {
    console.error("[api/upload-server] Exception:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    )
  }
}

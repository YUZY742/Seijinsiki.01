import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

// This route mints short-lived client upload tokens so the browser can upload
// large files (photos / videos up to ~200MB) directly to Vercel Blob,
// bypassing Vercel's 4.5MB serverless request body limit.
//
// Anyone with the site URL can upload (matches the user's "no auth" choice),
// but we still gate on file type and size here for safety.

const ALLOWED_PHOTO = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/gif"]
const ALLOWED_VIDEO = ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"]
const ALLOWED = [...ALLOWED_PHOTO, ...ALLOWED_VIDEO]

const MAX_BYTES = 200 * 1024 * 1024 // 200MB

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json()
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        console.log("[api/upload] Generating token for:", pathname)
        return {
          allowedContentTypes: ALLOWED,
          tokenPayload: JSON.stringify({ pathname }),
        }
      },
      onUploadCompleted: async ({ blob }) => {
        console.log("[api/upload] Upload completed:", blob.url)
      },
      // トークンを明示的に渡す
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })

    console.log("[api/upload] Token generated successfully, returning to client.")
    return NextResponse.json(json)
  } catch (error) {
    console.error("[api/upload] Error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 400 }
    )
  }
}

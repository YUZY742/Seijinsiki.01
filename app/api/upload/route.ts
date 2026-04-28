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
  const body = (await request.json()) as HandleUploadBody

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, _clientPayload) => {
        // Validate filename / extension as a first guard
        const lower = pathname.toLowerCase()
        const isPhoto = /\.(jpe?g|png|webp|heic|heif|gif)$/i.test(lower)
        const isVideo = /\.(mp4|mov|webm|m4v)$/i.test(lower)
        if (!isPhoto && !isVideo) {
          throw new Error("対応していないファイル形式です")
        }

        return {
          allowedContentTypes: ALLOWED,
          maximumSizeInBytes: MAX_BYTES,
          addRandomSuffix: true,
          // Tokens are valid for 30 minutes — plenty for a 200MB mobile upload.
          tokenPayload: JSON.stringify({ pathname }),
        }
      },
      onUploadCompleted: async ({ blob }) => {
        // We don't insert into the DB here because this callback only fires in
        // production (it requires a public URL). The client will POST to
        // /api/posts immediately after upload to record metadata.
        console.log("[v0] blob upload completed:", blob.pathname)
      },
    })

    return NextResponse.json(json)
  } catch (error) {
    const message = error instanceof Error ? error.message : "アップロードに失敗しました"
    console.log("[v0] upload route error:", message)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

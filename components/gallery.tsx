"use client"

import { useEffect, useState } from "react"
import { Play, X, ImageOff } from "lucide-react"
import type { Post } from "@/lib/types"

function formatDate(iso: string) {
  try {
    const d = new Date(iso)
    return d.toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })
  } catch {
    return ""
  }
}

export function Gallery({ posts }: { posts: Post[] }) {
  const [active, setActive] = useState<Post | null>(null)

  // Lock body scroll while lightbox is open (mobile-friendly)
  useEffect(() => {
    if (!active) return
    const original = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = original
    }
  }, [active])

  if (!posts.length) return null

  return (
    <>
      <ul className="grid grid-cols-3 gap-1.5 sm:grid-cols-4 md:gap-3 lg:grid-cols-5">
        {posts.map((post) => (
          <li key={post.id} className="group">
            <button
              type="button"
              onClick={() => setActive(post)}
              className="relative block aspect-square w-full overflow-hidden rounded-md border border-border bg-muted transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-ring md:rounded-lg"
            >
              {post.type === "photo" ? (
                <img
                  src={post.url || "/placeholder.svg"}
                  alt={post.caption ?? "投稿された写真"}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <video
                    src={post.url}
                    muted
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center bg-foreground/15">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-background/85 shadow md:h-12 md:w-12">
                      <Play className="h-4 w-4 fill-foreground text-foreground md:h-5 md:w-5" aria-hidden />
                    </span>
                  </span>
                </>
              )}
              {post.uploader_name && (
                <span className="absolute bottom-1 left-1 max-w-[calc(100%-0.5rem)] truncate rounded-md bg-background/85 px-1.5 py-0.5 text-[10px] text-foreground">
                  {post.uploader_name}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="投稿の詳細"
          className="fixed inset-0 z-50 flex flex-col bg-foreground/90 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <div className="flex shrink-0 justify-end p-3 md:p-4">
            <button
              type="button"
              onClick={() => setActive(null)}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-background/90 text-foreground hover:bg-background"
              aria-label="閉じる"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div
            className="flex flex-1 items-center justify-center px-3 pb-3 md:px-8 md:pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex w-full max-w-4xl flex-col items-center gap-3">
              {active.type === "photo" ? (
                <img
                  src={active.url || "/placeholder.svg"}
                  alt={active.caption ?? "投稿された写真"}
                  className="max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
                />
              ) : (
                <video
                  src={active.url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[70vh] w-full rounded-lg bg-foreground/40"
                />
              )}
              {(active.uploader_name || active.caption) && (
                <div className="w-full rounded-lg bg-background/95 px-4 py-3 text-sm">
                  <div className="flex items-center justify-between gap-3 text-muted-foreground">
                    <span className="truncate">{active.uploader_name ?? "匿名"}</span>
                    <span className="shrink-0 text-xs">{formatDate(active.created_at)}</span>
                  </div>
                  {active.caption && <p className="mt-1 text-foreground">{active.caption}</p>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

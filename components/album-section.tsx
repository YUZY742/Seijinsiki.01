"use client"

import useSWR from "swr"
import { Gallery } from "./gallery"
import { UploadCard } from "./upload-card"
import type { Post } from "@/lib/types"
import { Loader2, ExternalLink } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const DRIVE_URL = "https://drive.google.com/drive/folders/1fQqo9btsOmkSiRJCs_pqi4Iant0MfcFU?usp=sharing"

export function AlbumSection() {
  const { data, isLoading, mutate } = useSWR<{ posts: Post[] }>("/api/posts", fetcher, {
    revalidateOnFocus: false,
  })

  const posts = data?.posts ?? []
  const photoCount = posts.filter((p) => p.type === "photo").length
  const videoCount = posts.filter((p) => p.type === "video").length

  return (
    <section id="album" className="border-t border-border/60 bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-8 md:py-28">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-2 md:gap-3">
            <span className="text-[10px] tracking-[0.25em] text-muted-foreground md:text-xs md:tracking-[0.3em]">
              ALBUM
            </span>
            <h2 className="font-serif text-2xl text-foreground md:text-4xl">みんなのアルバム</h2>
            {posts.length > 0 && (
              <p className="text-sm text-muted-foreground">
                現在 <span className="font-medium text-foreground">{photoCount}</span> 枚の写真と{" "}
                <span className="font-medium text-foreground">{videoCount}</span> 本の動画
              </p>
            )}
          </div>
          <a
            href={DRIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary md:text-base"
          >
            Google Drive で全ての写真を見る
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-6 md:mt-10">
          <UploadCard onUploaded={() => mutate()} />
        </div>

        <div className="mt-8 md:mt-12">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-16 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> 読み込み中…
            </div>
          ) : (
            <Gallery posts={posts} />
          )}
        </div>
      </div>
    </section>
  )
}

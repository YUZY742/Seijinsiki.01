"use client"

import useSWR from "swr"
import { Gallery } from "./gallery"
import { UploadCard } from "./upload-card"
import type { Post } from "@/lib/types"
import { Loader2 } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())
const LINE_OPEN_CHAT_URL = "https://line.me/ti/g2/i-2PJZdg1DdGYC_f5t-uIVHPXfh0c7VBvQY70A?utm_source=invitation&utm_medium=link_copy&utm_campaign=default"

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
        {/* ヘッダー */}
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

        {/* LINEオープンチャットへの誘導バナー */}
        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-[#06C755]/30 bg-[#06C755]/5 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">📸 大きな動画・追加の写真はオープンチャットへ！</p>
            <p className="text-xs text-muted-foreground mt-0.5">「掛川北27年/１月同窓会」のLINEグループでも写真・動画を共有できます</p>
          </div>
          <a
            href={LINE_OPEN_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#06C755] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <svg width="16" height="16" viewBox="0 0 40 40" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 4C11.163 4 4 10.268 4 18c0 5.16 2.99 9.687 7.5 12.335L10 36l6.125-2.97C17.37 33.33 18.668 33.5 20 33.5c8.837 0 16-6.268 16-14S28.837 4 20 4z"/>
            </svg>
            オープンチャットに参加
          </a>
        </div>

        {/* アップロードカード */}
        <div className="mt-6 md:mt-8">
          <UploadCard onUploaded={() => mutate()} />
        </div>

        {/* ギャラリー */}
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

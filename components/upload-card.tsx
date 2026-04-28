"use client"

import { useCallback, useRef, useState } from "react"
import { upload } from "@vercel/blob/client"
import { toast } from "sonner"
import { ImagePlus, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const MAX_BYTES = 200 * 1024 * 1024 // 200MB

type Item = {
  id: string
  file: File
  progress: number
  status: "queued" | "uploading" | "saving" | "done" | "error"
  error?: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function UploadCard({ onUploaded }: { onUploaded?: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [items, setItems] = useState<Item[]>([])
  const [uploaderName, setUploaderName] = useState("")
  const [caption, setCaption] = useState("")

  const addFiles = useCallback((files: FileList | File[]) => {
    const list = Array.from(files)
    const valid: Item[] = []
    for (const file of list) {
      if (file.size > MAX_BYTES) {
        toast.error(`${file.name} は200MBを超えています`)
        continue
      }
      const isPhoto = file.type.startsWith("image/")
      const isVideo = file.type.startsWith("video/")
      if (!isPhoto && !isVideo) {
        toast.error(`${file.name} は画像または動画ファイルではありません`)
        continue
      }
      valid.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        progress: 0,
        status: "queued",
      })
    }
    if (valid.length) setItems((prev) => [...prev, ...valid])
  }, [])

  const updateItem = useCallback((id: string, patch: Partial<Item>) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }, [])

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id))
  }, [])

  async function uploadAll() {
    const queued = items.filter((it) => it.status === "queued" || it.status === "error")
    if (!queued.length) {
      toast.info("アップロードするファイルを選択してください")
      return
    }

    for (const item of queued) {
      try {
        updateItem(item.id, { status: "uploading", progress: 0, error: undefined })

        const blob = await upload(item.file.name, item.file, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: item.file.type,
          onUploadProgress: ({ percentage }) => {
            updateItem(item.id, { progress: percentage })
          },
        })

        updateItem(item.id, { status: "saving", progress: 100 })

        const res = await fetch("/api/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: blob.url,
            pathname: blob.pathname,
            contentType: item.file.type,
            sizeBytes: item.file.size,
            uploaderName: uploaderName || null,
            caption: caption || null,
          }),
        })
        if (!res.ok) {
          const json = await res.json().catch(() => ({}))
          throw new Error(json?.error ?? "保存に失敗しました")
        }

        updateItem(item.id, { status: "done" })
      } catch (err) {
        const msg = err instanceof Error ? err.message : "アップロードに失敗しました"
        updateItem(item.id, { status: "error", error: msg })
        toast.error(`${item.file.name}: ${msg}`)
      }
    }

    const ok = items.length > 0
    if (ok) {
      toast.success("アップロードが完了しました")
      onUploaded?.()
      setItems((prev) => prev.filter((it) => it.status !== "done"))
    }
  }

  const isWorking = items.some((it) => it.status === "uploading" || it.status === "saving")

  return (
    <div className="rounded-2xl border border-border bg-card p-5 md:p-8">
      <div className="flex flex-col gap-1">
        <h3 className="font-serif text-lg text-foreground md:text-2xl">写真・動画をシェアする</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          1ファイル200MBまで。複数同時OK。
        </p>
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-6 py-8 text-center transition-colors hover:border-accent/60 active:bg-accent/10 md:py-10"
      >
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/15">
          <ImagePlus className="h-6 w-6 text-primary" aria-hidden />
        </span>
        <span className="text-base font-medium text-foreground">タップしてファイルを選択</span>
        <span className="text-xs text-muted-foreground">JPG・PNG・HEIC・MP4・MOV ／ 200MBまで</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files?.length) addFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </button>

      {items.length > 0 && (
        <ul className="mt-4 flex flex-col gap-2">
          {items.map((it) => (
            <li
              key={it.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate text-sm text-foreground">{it.file.name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatSize(it.file.size)}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={`h-full transition-all ${it.status === "error" ? "bg-destructive" : "bg-primary"}`}
                    style={{ width: `${it.progress}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {it.status === "queued" && "待機中"}
                  {it.status === "uploading" && `アップロード中… ${Math.round(it.progress)}%`}
                  {it.status === "saving" && "保存中…"}
                  {it.status === "done" && "完了"}
                  {it.status === "error" && (it.error ?? "エラー")}
                </div>
              </div>

              {it.status === "uploading" || it.status === "saving" ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" aria-label="処理中" />
              ) : (
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
                  aria-label="削除"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {items.length > 0 && (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="uploader" className="text-sm">
              お名前（任意）
            </Label>
            <Input
              id="uploader"
              value={uploaderName}
              onChange={(e) => setUploaderName(e.target.value)}
              placeholder="山田 太郎"
              maxLength={60}
              className="h-11 text-base"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="caption" className="text-sm">
              ひとこと（任意）
            </Label>
            <Input
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="2年3組の文化祭にて"
              maxLength={140}
              className="h-11 text-base"
            />
          </div>
        </div>
      )}

      <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button
          onClick={uploadAll}
          disabled={isWorking || !items.length}
          size="lg"
          className="h-12 rounded-full text-base sm:min-w-44"
        >
          {isWorking ? "アップロード中..." : "アップロードする"}
        </Button>
      </div>
    </div>
  )
}

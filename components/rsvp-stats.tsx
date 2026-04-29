"use client"

import useSWR from "swr"
import { Users, User, UserCheck } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function RsvpStats() {
  const { data, isLoading } = useSWR("/api/rsvp-stats", fetcher)

  if (isLoading || !data || data.error) {
    return (
      <div className="grid grid-cols-2 gap-4 animate-pulse md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted/50" />
        ))}
      </div>
    )
  }

  const { byClass = {}, male = 0, female = 0, total = 0 } = data

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3 md:gap-6">
        {/* 全体 */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3 shadow-sm">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">合計</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-foreground">{total}</span>
              <span className="text-[10px] text-muted-foreground">名</span>
            </div>
          </div>
        </div>

        {/* 男女 */}
        <div className="flex items-center gap-4 px-2">
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-blue-500" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-foreground">{male}</span>
              <span className="text-[10px] text-muted-foreground">名</span>
            </div>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-pink-500" />
            <div className="flex items-baseline gap-0.5">
              <span className="text-lg font-bold text-foreground">{female}</span>
              <span className="text-[10px] text-muted-foreground">名</span>
            </div>
          </div>
        </div>
      </div>

      {/* クラス別（よりコンパクトに） */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(byClass).map(([num, count]: [string, any]) => (
          <div key={num} className="flex min-w-[70px] flex-1 items-center justify-between gap-3 rounded-xl border border-border bg-card px-3 py-2 shadow-sm md:flex-none">
            <span className="text-[11px] font-medium text-muted-foreground">{num}組</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-sm font-bold text-foreground">{count}</span>
              <span className="text-[9px] text-muted-foreground">名</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

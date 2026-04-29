"use client"

import useSWR from "swr"
import { Users, User, UserCheck } from "lucide-react"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function RsvpStats() {
  const { data, isLoading } = useSWR("/api/rsvp-stats", fetcher)

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 animate-pulse md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted/50" />
        ))}
      </div>
    )
  }

  const { byClass, male, female, total } = data

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {/* 全体 */}
        <div className="col-span-2 flex flex-col gap-1 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium uppercase tracking-wider">出席予定 合計</span>
            <Users className="h-4 w-4" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-foreground">{total}</span>
            <span className="text-sm text-muted-foreground">名</span>
          </div>
        </div>

        {/* 男女 */}
        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">男性</span>
            <User className="h-3.5 w-3.5 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{male}</span>
            <span className="text-xs text-muted-foreground">名</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-medium">女性</span>
            <User className="h-3.5 w-3.5 text-pink-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-foreground">{female}</span>
            <span className="text-xs text-muted-foreground">名</span>
          </div>
        </div>

        {/* クラス別（モバイルでは4列表示に収まらないのでグリッド調整） */}
        {Object.entries(byClass).map(([num, count]: [string, any]) => (
          <div key={num} className="flex flex-col gap-1 rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
            <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {num}組
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-foreground md:text-2xl">{count}</span>
              <span className="text-[10px] text-muted-foreground md:text-xs">名</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

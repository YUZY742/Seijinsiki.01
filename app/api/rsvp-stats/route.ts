import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getServerSupabase()

    // 出席予定者のクラス別・性別集計
    const { data, error } = await supabase
      .from("rsvps")
      .select("class_number, gender, attendance")
      .eq("attendance", "attend")

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const rows = data ?? []

    // クラス別集計（1〜5組）
    const byClass: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
    let maleCount = 0
    let femaleCount = 0

    for (const row of rows) {
      if (row.class_number && byClass[row.class_number] !== undefined) {
        byClass[row.class_number]++
      }
      if (row.gender === "male") maleCount++
      if (row.gender === "female") femaleCount++
    }

    return NextResponse.json({
      total: rows.length,
      byClass,
      male: maleCount,
      female: femaleCount,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

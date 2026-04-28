import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, kana, attendance, message } = body ?? {}

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "お名前を入力してください" }, { status: 400 })
    }
    if (!["attend", "absent"].includes(attendance)) {
      return NextResponse.json({ error: "出欠を選択してください" }, { status: 400 })
    }

    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("rsvps")
      .insert({
        name: String(name).slice(0, 60),
        kana: kana ? String(kana).slice(0, 80) : null,
        attendance,
        guests: 0,
        message: message ? String(message).slice(0, 600) : null,
      })
      .select("*")
      .single()

    if (error) {
      console.log("[v0] rsvp insert error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rsvp: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.log("[v0] rsvp POST exception:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

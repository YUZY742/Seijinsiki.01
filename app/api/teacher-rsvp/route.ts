import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("teacher_rsvps")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ rsvps: data ?? [] })
  } catch (err) {
    return NextResponse.json({ error: "Unknown error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, kana, subject, attendance, message, phone, email } = body ?? {}

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "お名前を入力してください" }, { status: 400 })
    }
    if (!["attend", "absent"].includes(attendance)) {
      return NextResponse.json({ error: "出欠を選択してください" }, { status: 400 })
    }

    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("teacher_rsvps")
      .insert({
        name: String(name).slice(0, 60),
        kana: kana ? String(kana).slice(0, 80) : null,
        subject: subject ? String(subject).slice(0, 60) : null,
        attendance,
        message: message ? String(message).slice(0, 600) : null,
        phone: phone ? String(phone).slice(0, 20) : null,
        email: email ? String(email).slice(0, 100) : null,
      })
      .select("*")
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ rsvp: data })
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("kana", { ascending: true, nullsFirst: false })

    if (error) {
      console.log("[v0] rsvp GET error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ rsvps: data ?? [] })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.log("[v0] rsvp GET exception:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, kana, attendance, message, classNumber, phone, email, gender } = body ?? {}

    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "お名前を入力してください" }, { status: 400 })
    }
    if (!phone || typeof phone !== "string") {
      return NextResponse.json({ error: "電話番号を入力してください" }, { status: 400 })
    }
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "メールアドレスを入力してください" }, { status: 400 })
    }
    if (!["attend", "absent"].includes(attendance)) {
      return NextResponse.json({ error: "出欠を選択してください" }, { status: 400 })
    }
    if (attendance === "attend" && !["male", "female"].includes(gender)) {
      return NextResponse.json({ error: "性別を選択してください" }, { status: 400 })
    }

    const supabase = getServerSupabase()
    const { data, error } = await supabase
      .from("rsvps")
      .insert({
        name: String(name).slice(0, 60),
        kana: kana ? String(kana).slice(0, 80) : null,
        attendance,
        class_number: typeof classNumber === "number" ? classNumber : null,
        guests: 0,
        message: message ? String(message).slice(0, 600) : null,
        phone: String(phone).slice(0, 20),
        email: String(email).slice(0, 100),
        gender: gender || null,
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

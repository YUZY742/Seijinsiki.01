import { NextResponse } from "next/server"
import { getServerSupabase } from "@/lib/supabase/server"
import { Resend } from "resend"

export const dynamic = "force-dynamic"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { subject, body: emailBody } = body ?? {}

    if (!subject || !emailBody) {
      return NextResponse.json({ error: "件名と本文を入力してください" }, { status: 400 })
    }

    // 出席予定者のメールアドレスを全員取得
    const supabase = getServerSupabase()
    const { data: rsvps, error } = await supabase
      .from("rsvps")
      .select("name, email")
      .eq("attendance", "attend")
      .not("email", "is", null)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!rsvps || rsvps.length === 0) {
      return NextResponse.json({ error: "出席予定者のメールアドレスが登録されていません" }, { status: 400 })
    }

    const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev"

    // 1件ずつ送信（BCC一括送信でもOKだが、個人宛に丁寧に送る）
    const results = await Promise.allSettled(
      rsvps.map(async (rsvp) => {
        await resend.emails.send({
          from: fromEmail,
          to: rsvp.email,
          subject,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <h2 style="color: #1a1a1a; font-size: 20px;">${rsvp.name} さんへ</h2>
              <div style="color: #333; line-height: 1.8; white-space: pre-wrap;">${emailBody.replace(/\n/g, "<br>")}</div>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="color: #999; font-size: 12px;">
                このメールは掛川北中学校 成人式実行委員会よりお送りしています。<br>
                ご不明な点はサイトのフォームからご連絡ください。
              </p>
            </div>
          `,
        })
        return rsvp.email
      })
    )

    const succeeded = results.filter((r) => r.status === "fulfilled").length
    const failed = results.filter((r) => r.status === "rejected").length

    return NextResponse.json({
      message: `送信完了: ${succeeded}件成功、${failed}件失敗`,
      total: rsvps.length,
      succeeded,
      failed,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("[send-reminder] error:", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

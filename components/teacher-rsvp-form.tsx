"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CheckCircle2 } from "lucide-react"

type Attendance = "attend" | "absent"

export function TeacherRsvpForm() {
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [name, setName] = useState("")
  const [kana, setKana] = useState("")
  const [subject, setSubject] = useState("")
  const [attendance, setAttendance] = useState<Attendance>("attend")
  const [message, setMessage] = useState("")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) { toast.error("お名前を入力してください"); return }

    setSubmitting(true)
    try {
      const res = await fetch("/api/teacher-rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, kana, subject, attendance, message, phone, email }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error ?? "送信に失敗しました")
      setDone(true)
      toast.success("先生のご回答を受け付けました。ありがとうございます。")
    } catch (err) {
      const msg = err instanceof Error ? err.message : "送信に失敗しました"
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6 md:p-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/20">
            <CheckCircle2 className="h-7 w-7 text-primary" aria-hidden />
          </span>
          <h3 className="font-serif text-xl text-foreground md:text-2xl">ありがとうございます</h3>
          <p className="max-w-md text-sm text-muted-foreground leading-relaxed md:text-base">
            ご回答を受け付けました。当日お会いできることを楽しみにしております。
          </p>
          <Button variant="outline" className="h-11 rounded-full" onClick={() => {
            setDone(false); setName(""); setKana(""); setSubject(""); setAttendance("attend"); setMessage(""); setPhone(""); setEmail("")
          }}>
            もう一度回答する
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 md:gap-6 md:p-10 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="t-name" className="text-sm">お名前 <span className="text-accent">*</span></Label>
          <Input id="t-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="掛川 先生" required className="h-11 text-base" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="t-subject" className="text-sm">担当教科等（任意）</Label>
          <Input id="t-subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="数学、3年1組担任など" className="h-11 text-base" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="t-phone" className="text-sm">電話番号（任意）</Label>
          <Input id="t-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="090-0000-0000" className="h-11 text-base" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="t-email" className="text-sm">メールアドレス（任意）</Label>
          <Input id="t-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="teacher@email.com" className="h-11 text-base" />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <Label className="text-sm">ご出欠 <span className="text-accent">*</span></Label>
        <RadioGroup value={attendance} onValueChange={(v) => setAttendance(v as Attendance)} className="grid gap-2 sm:grid-cols-2">
          {[
            { value: "attend", label: "参加します" },
            { value: "absent", label: "欠席します" },
          ].map((opt) => (
            <Label key={opt.value} htmlFor={`t-att-${opt.value}`} className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-accent/10">
              <RadioGroupItem id={`t-att-${opt.value}`} value={opt.value} />
              <span className="text-base font-medium">{opt.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="t-message" className="text-sm">
          ひとこと（教え子たちへ）
          <span className="block mt-1 text-[10px] font-normal text-muted-foreground">
            ※メッセージは当日お越しになれない先生からの言葉として紹介させていただく場合がございます。
          </span>
        </Label>
        <Textarea id="t-message" value={message} onChange={(e) => setMessage(e.target.value)} placeholder="楽しみにしています！" rows={4} className="text-base" />
      </div>

      <div className="flex flex-col gap-3 border-t border-border/60 pt-5 md:flex-row md:items-center md:justify-end md:pt-6">
        <Button type="submit" size="lg" disabled={submitting} className="h-12 w-full rounded-full text-base md:w-auto">
          {submitting ? "送信中..." : "先生として送信する"}
        </Button>
      </div>
    </form>
  )
}

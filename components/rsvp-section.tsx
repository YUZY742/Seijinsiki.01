import { RsvpForm } from "./rsvp-form"
import { TeacherRsvpForm } from "./teacher-rsvp-form"
import { RsvpStats } from "./rsvp-stats"

export function RsvpSection() {
  return (
    <section id="rsvp" className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-8 md:py-28">
        <div className="flex flex-col gap-8 md:gap-16">
          
          {/* 参加状況の統計 */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 md:gap-3">
              <span className="text-[10px] tracking-[0.25em] text-muted-foreground md:text-xs md:tracking-[0.3em]">
                LIVE UPDATES
              </span>
              <h2 className="font-serif text-2xl text-foreground md:text-4xl">現在の参加状況</h2>
              <p className="text-sm text-muted-foreground leading-relaxed md:text-base">
                リアルタイムで出席予定人数を集計しています。
              </p>
            </div>
            <RsvpStats />
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* 生徒用フォーム */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 md:gap-3">
                <span className="text-[10px] tracking-[0.25em] text-muted-foreground md:text-xs md:tracking-[0.3em]">
                  FOR STUDENTS
                </span>
                <h2 className="font-serif text-2xl text-foreground md:text-4xl">出欠回答</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  会場手配の都合上、<span className="text-foreground font-medium">2026年10月30日（金）</span>
                  までにご回答ください。
                </p>
              </div>
              <RsvpForm />
            </div>

            {/* 先生用フォーム */}
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-2 md:gap-3">
                <span className="text-[10px] tracking-[0.25em] text-muted-foreground md:text-xs md:tracking-[0.3em]">
                  FOR TEACHERS
                </span>
                <h2 className="font-serif text-2xl text-foreground md:text-4xl">恩師の皆様へ</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  恩師の皆様のご参加も心よりお待ちしております。<br />
                  お手数ですが、こちらから出欠をお知らせいただけますと幸いです。
                </p>
              </div>
              <TeacherRsvpForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

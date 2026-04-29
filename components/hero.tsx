import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Bell } from "lucide-react"

export function Hero({ settings, announcements }: { settings?: any, announcements?: any[] }) {
  // Use DB settings if available, otherwise fallback to defaults
  const dateStr = settings?.event_date ? settings.event_date.split("年")[1].split("日")[0].replace("月", ".") : "01.09"
  const timeStr = settings?.event_time || "15:00 開宴"
  const venueStr = settings?.venue_name || "パレスホテル掛川"
  const feeStr = settings?.fee_amount || "8,000円"
  const venueUrl = settings?.venue_url || "https://breezbay-group.com/kakegawa-ph/"

  return (
    <section id="top" className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/hero-reunion.jpg"
          alt="夕陽の差し込む静かな教室"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 pb-12 pt-14 md:gap-8 md:px-8 md:py-36">
        {announcements && announcements.length > 0 && (
          <div className="w-full max-w-2xl bg-card/80 backdrop-blur border border-primary/20 rounded-xl p-4 shadow-sm mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-primary" />
              <h3 className="font-medium text-sm text-foreground">新着のお知らせ</h3>
            </div>
            <div className="space-y-3">
              {announcements.map((a: any) => (
                <div key={a.id} className="border-t border-border/50 pt-2 first:border-0 first:pt-0">
                  <span className="text-[10px] text-muted-foreground">{new Date(a.created_at).toLocaleDateString("ja-JP")}</span>
                  <h4 className="font-medium text-sm mt-0.5">{a.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">{a.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[10px] tracking-[0.25em] text-muted-foreground backdrop-blur md:px-4 md:py-1.5 md:text-xs md:tracking-[0.3em]">
          KAKEGAWA KITA JHS REUNION
        </span>

        <h1 className="max-w-3xl text-pretty font-serif text-[2.25rem] leading-[1.15] text-foreground md:text-6xl">
          仲間との再会
        </h1>

        <div className="flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button asChild size="lg" className="h-12 w-full rounded-full px-7 text-base sm:w-auto">
            <Link href="#rsvp">出欠を回答する</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 w-full rounded-full bg-card/60 px-7 text-base backdrop-blur sm:w-auto"
          >
            <Link href="#album">写真・動画を見る</Link>
          </Button>
        </div>

        <dl className="mt-4 grid w-full max-w-2xl grid-cols-3 gap-3 border-t border-border/60 pt-6 md:mt-8 md:gap-4 md:pt-8">
          <Stat label="日時" value={dateStr} sub={timeStr} />
          <Stat 
            label="会場" 
            value={venueStr} 
            sub="掛川" 
            href={venueUrl}
          />
          <Stat label="会費" value={feeStr} sub="当日支払" />
        </dl>
      </div>
    </section>
  )
}

function Stat({ label, value, sub, href }: { label: string; value: string; sub: string; href?: string }) {
  const Content = (
    <div className={`group ${href ? "cursor-pointer" : ""}`}>
      <dt className="text-[10px] tracking-[0.2em] text-muted-foreground md:text-[11px] md:tracking-[0.25em]">{label}</dt>
      <dd className={`mt-1 font-serif text-lg leading-tight text-foreground md:text-2xl ${href ? "group-hover:text-primary transition-colors underline decoration-primary/30 underline-offset-4" : ""}`}>
        {value}
      </dd>
      <dd className="text-[11px] text-muted-foreground md:text-xs">{sub}</dd>
    </div>
  )

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {Content}
      </a>
    )
  }

  return Content
}

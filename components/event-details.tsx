import { CalendarDays, MapPin, Wallet, Users } from "lucide-react"

export function EventDetails({ settings }: { settings?: any }) {
  const items = [
    {
      icon: CalendarDays,
      label: "日時",
      value: settings?.event_date || "2027年1月9日（土）",
      sub: settings?.event_time || "15:00 開宴",
    },
    {
      icon: MapPin,
      label: "会場",
      value: settings?.venue_name || "パレスホテル掛川",
      sub: settings?.venue_address || "静岡県掛川市亀の甲2-8-15",
      href: settings?.venue_url || "https://breezbay-group.com/kakegawa-ph/",
    },
    {
      icon: Wallet,
      label: "会費",
      value: settings?.fee_amount || "8,000円",
      sub: settings?.fee_note || "当日受付にて現金でお支払い",
    },
    {
      icon: Users,
      label: "対象",
      value: settings?.target_audience || "掛川北中学校 卒業生",
      sub: settings?.target_note || "27年度二十歳の集い 参加者",
    },
  ]

  return (
    <section id="about" className="border-t border-border/60 bg-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:px-8 md:py-28">
        <div className="flex flex-col gap-2 md:gap-3">
          <span className="text-[10px] tracking-[0.25em] text-muted-foreground md:text-xs md:tracking-[0.3em]">
            ABOUT
          </span>
          <h2 className="font-serif text-2xl text-foreground md:text-4xl">開催概要</h2>
        </div>

        <ul className="mt-8 grid gap-3 md:mt-12 md:grid-cols-2 md:gap-4">
          {items.map(({ icon: Icon, label, value, sub, href }) => {
            const Content = (
              <>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 md:h-11 md:w-11">
                  <Icon className="h-5 w-5 text-primary" aria-hidden />
                </span>
                <div className="flex min-w-0 flex-col gap-1 text-left">
                  <span className="text-[10px] tracking-[0.2em] text-muted-foreground md:text-[11px] md:tracking-[0.25em]">
                    {label}
                  </span>
                  <span className="font-serif text-base text-foreground md:text-xl">{value}</span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{sub}</span>
                </div>
              </>
            )

            return (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/60 hover:bg-accent/5 md:p-6"
                  >
                    {Content}
                  </a>
                ) : (
                  <div className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 md:p-6">
                    {Content}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

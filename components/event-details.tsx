import { CalendarDays, MapPin, Wallet, Users } from "lucide-react"

const items = [
  {
    icon: CalendarDays,
    label: "日時",
    value: "2027年1月9日（土）",
    sub: "15:00 開宴",
  },
  {
    icon: MapPin,
    label: "会場",
    value: "パレスホテル掛川",
    sub: "静岡県掛川市駅前",
  },
  {
    icon: Wallet,
    label: "会費",
    value: "8,000円",
    sub: "一律（特例なし）／ 当日受付にてお支払い",
  },
  {
    icon: Users,
    label: "対象",
    value: "掛川北中学校 卒業生",
    sub: "令和7年度（27年度）二十歳の集い 参加者",
  },
]

export function EventDetails() {
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
          {items.map(({ icon: Icon, label, value, sub }) => (
            <li
              key={label}
              className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/60 md:p-6"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 md:h-11 md:w-11">
                <Icon className="h-5 w-5 text-primary" aria-hidden />
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <span className="text-[10px] tracking-[0.2em] text-muted-foreground md:text-[11px] md:tracking-[0.25em]">
                  {label}
                </span>
                <span className="font-serif text-base text-foreground md:text-xl">{value}</span>
                <span className="text-sm text-muted-foreground leading-relaxed">{sub}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

import { RsvpForm } from "./rsvp-form"

export function RsvpSection() {
  return (
    <section id="rsvp" className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto w-full max-w-3xl px-4 py-14 md:px-8 md:py-28">
        <div className="flex flex-col gap-2 md:gap-3">
          <span className="text-[10px] tracking-[0.25em] text-muted-foreground md:text-xs md:tracking-[0.3em]">
            RSVP
          </span>
          <h2 className="font-serif text-2xl text-foreground md:text-4xl">出欠回答</h2>
          <p className="text-pretty text-sm text-muted-foreground leading-relaxed md:text-base">
            会場手配の都合上、<span className="text-foreground">2026年11月30日（月）</span>
            までにご回答ください。あとから変更があれば、もう一度送信していただいてかまいません。
          </p>
        </div>

        <div className="mt-6 md:mt-10">
          <RsvpForm />
        </div>
      </div>
    </section>
  )
}

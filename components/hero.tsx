import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
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
        <span className="rounded-full border border-border/70 bg-card/70 px-3 py-1 text-[10px] tracking-[0.25em] text-muted-foreground backdrop-blur md:px-4 md:py-1.5 md:text-xs md:tracking-[0.3em]">
          KAKEGAWA KITA JHS REUNION
        </span>

        <h1 className="max-w-3xl text-pretty font-serif text-[2.25rem] leading-[1.15] text-foreground md:text-6xl">
          あの日の教室から、
          <br />
          <span className="text-primary">もう一度。</span>
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
          <Stat label="日時" value="01.09" sub="土 15:00〜" />
          <Stat label="会場" value="パレス" sub="掛川" />
          <Stat label="会費" value="¥8,000" sub="一律" />
        </dl>
      </div>
    </section>
  )
}

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div>
      <dt className="text-[10px] tracking-[0.2em] text-muted-foreground md:text-[11px] md:tracking-[0.25em]">{label}</dt>
      <dd className="mt-1 font-serif text-lg leading-tight text-foreground md:text-2xl">{value}</dd>
      <dd className="text-[11px] text-muted-foreground md:text-xs">{sub}</dd>
    </div>
  )
}

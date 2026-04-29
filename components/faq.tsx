import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const items = [
  {
    q: "対象は誰ですか？",
    a: "掛川北中学校の卒業生で、令和7年度（27年度）の「二十歳の集い」に参加された方が対象です。",
  },
  {
    q: "会費はいくらですか？",
    a: "一律 8,000円です。学割や特例はありません。当日、受付にてお支払いください。",
  },
  {
    q: "回答の期限はいつまでですか？",
    a: "2026年10月30日（金）までにご回答をお願いします。会場の人数確定の都合上、期限を過ぎると対応が難しくなります。",
  },
  {
    q: "出欠を変更したいときは？",
    a: "期限内であれば、もう一度同じフォームから送信してください。最新の回答で上書きします。",
  },
  {
    q: "写真や動画は誰でも見られますか？",
    a: "このサイトのURLを知っている人なら誰でも閲覧できます。SNSなどへの転載は、写っている方の許可を取ってからにしてください。",
  },
  {
    q: "アップロードできるサイズは？",
    a: "1ファイルあたり最大200MBまでです。写真・動画ともに、当時の思い出のものでも、近況のものでも歓迎です。",
  },
  {
    q: "投稿した写真を取り下げたいときは？",
    a: "幹事までDM・LINEでご連絡ください。すぐに非表示にします。",
  },
]

export function Faq() {
  return (
    <section id="faq" className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto w-full max-w-3xl px-4 py-14 md:px-8 md:py-28">
        <div className="flex flex-col gap-2 md:gap-3">
          <span className="text-[10px] tracking-[0.25em] text-muted-foreground md:text-xs md:tracking-[0.3em]">
            FAQ
          </span>
          <h2 className="font-serif text-2xl text-foreground md:text-4xl">よくある質問</h2>
        </div>

        <Accordion type="single" collapsible className="mt-6 w-full md:mt-8">
          {items.map((item, i) => (
            <AccordionItem key={i} value={`q-${i}`} className="border-border">
              <AccordionTrigger className="py-4 text-left text-sm font-medium hover:no-underline md:text-base">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground leading-relaxed md:text-base">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

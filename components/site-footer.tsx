export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-10 text-sm md:flex-row md:items-end md:justify-between md:px-8 md:py-12">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-lg text-foreground md:text-xl">掛川北中学校 同窓会</span>
            <span className="text-xs tracking-[0.3em] text-muted-foreground">2027</span>
          </div>
          <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
            お問い合わせ・写真の取り下げ依頼は幹事まで。
          </p>
          <div className="flex gap-4 mt-1">
            <a 
              href="https://instagram.com/direct/inbox/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              Instagram DMで送る
            </a>
            <a 
              href="https://instagram.com/example" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-primary transition-colors"
            >
              公式プロフィール
            </a>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">© 掛川北中学校 同窓会幹事会</p>
      </div>
    </footer>
  )
}

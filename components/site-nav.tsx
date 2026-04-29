"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const links = [
  { href: "#about", label: "開催概要" },
  { href: "#rsvp", label: "出欠回答" },
  { href: "#album", label: "アルバム" },
  { href: "#faq", label: "よくある質問" },
]

export function SiteNav() {
  const [open, setOpen] = useState(false)
  const [clickCount, setClickCount] = useState(0)

  const handleAdminClick = () => {
    const nextCount = clickCount + 1
    if (nextCount >= 5) {
      window.location.href = "/admin"
    }
    setClickCount(nextCount)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:h-16 md:px-8">
        <div className="flex min-w-0 items-baseline gap-2">
          <Link href="#top" className="flex items-baseline gap-2">
            <span className="truncate font-serif text-base font-medium tracking-wide text-foreground md:text-xl">
              掛川北中 同窓會
            </span>
          </Link>
          <span 
            className="hidden text-xs tracking-[0.3em] text-muted-foreground sm:inline cursor-default select-none"
            onClick={handleAdminClick}
          >
            2027
          </span>
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Button asChild size="sm" className="rounded-full">
            <Link href="#rsvp">出欠を回答する</Link>
          </Button>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
          aria-label="メニューを開く"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/60 bg-background md:hidden">
          <nav className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base text-foreground hover:bg-muted"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild size="lg" className="mt-2 h-12 rounded-full text-base">
              <Link href="#rsvp" onClick={() => setOpen(false)}>
                出欠を回答する
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}

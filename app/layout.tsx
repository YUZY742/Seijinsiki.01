import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono, Noto_Serif_JP } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-serif-jp",
})

export const metadata: Metadata = {
  title: "掛川北中学校 同窓会 | 令和7年度 二十歳の集い 参加者の皆さまへ",
  description:
    "掛川北中学校 卒業生・令和7年度 二十歳の集い参加者の同窓会ご案内。2027年1月9日（土）パレスホテル掛川にて開催。出欠回答と写真・動画の共有はこちらから。",
  generator: "v0.app",
  openGraph: {
    title: "掛川北中学校 同窓会 | あの日の教室から、もう一度。",
    description: "2027年1月9日（土）パレスホテル掛川。掛川北中学校 卒業生の同窓会ご案内。",
    type: "website",
    locale: "ja_JP",
  },
}

export const viewport: Viewport = {
  themeColor: "#f6f1e6",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`bg-background ${geistSans.variable} ${geistMono.variable} ${notoSerifJP.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Toaster richColors position="top-center" />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}

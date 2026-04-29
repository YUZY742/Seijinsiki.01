import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { EventDetails } from "@/components/event-details"
import { RsvpSection } from "@/components/rsvp-section"
import { AlbumSection } from "@/components/album-section"
import { Faq } from "@/components/faq"
import { SiteFooter } from "@/components/site-footer"
import { getEventSettings, getAnnouncements } from "@/app/actions/admin"

export const dynamic = 'force-dynamic'

export default async function Home() {
  const [settings, announcements] = await Promise.all([
    getEventSettings(),
    getAnnouncements()
  ])

  return (
    <main className="min-h-svh bg-background">
      <SiteNav />
      <Hero settings={settings} announcements={announcements} />
      <EventDetails settings={settings} />
      <RsvpSection />
      <AlbumSection />
      <Faq />
      <SiteFooter />
    </main>
  )
}

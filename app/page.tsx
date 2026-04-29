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
  return (
    <main className="min-h-svh bg-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Debug Mode</h1>
        <p>If you see this, the layout and basic page are working.</p>
      </div>
    </main>
  )
}

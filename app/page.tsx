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
  let settings = null
  let announcements = []

  try {
    const results = await Promise.allSettled([
      getEventSettings(),
      getAnnouncements()
    ])
    
    if (results[0].status === 'fulfilled') settings = results[0].value
    if (results[1].status === 'fulfilled') announcements = results[1].value
  } catch (error) {
    console.error("Failed to fetch initial data:", error)
  }

  return (
    <main className="min-h-svh bg-background flex flex-col">
      <SiteNav />
      <div className="flex-1 flex items-center justify-center p-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Minimal Mode</h1>
          <p>SiteNav and SiteFooter are enabled.</p>
        </div>
      </div>
      <SiteFooter />
    </main>
  )
}

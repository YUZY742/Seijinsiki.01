import { SiteNav } from "@/components/site-nav"
import { Hero } from "@/components/hero"
import { EventDetails } from "@/components/event-details"
import { RsvpSection } from "@/components/rsvp-section"
import { AlbumSection } from "@/components/album-section"
import { Faq } from "@/components/faq"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <main className="min-h-svh bg-background">
      <SiteNav />
      <Hero />
      <EventDetails />
      <RsvpSection />
      <AlbumSection />
      <Faq />
      <SiteFooter />
    </main>
  )
}

import { createClient } from "@supabase/supabase-js"

// Server-only Supabase client. Uses the service role key to bypass RLS for
// trusted server actions (rsvp insert, post insert/list including admin).
// Never import this from client components.
export function getServerSupabase() {
  const url = process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    throw new Error("Supabase env vars are not set: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY")
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

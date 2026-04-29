"use server"

import { revalidatePath } from "next/cache"
import { getServerSupabase } from "@/lib/supabase/server"
import { del } from "@vercel/blob"

// ----------------------------------------------------------------------
// RSVP (参加者名簿) 管理
// ----------------------------------------------------------------------

export async function addRsvp(data: { name: string; kana?: string; attendance: string; guests: number; message?: string; class_number?: number; phone?: string; email?: string; gender?: string }) {
  const supabase = getServerSupabase()
  const { error } = await supabase.from("rsvps").insert(data)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

export async function updateRsvp(id: string, data: { name: string; kana?: string; attendance: string; guests: number; message?: string; class_number?: number; phone?: string; email?: string; gender?: string }) {
  const supabase = getServerSupabase()
  const { error } = await supabase.from("rsvps").update(data).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

export async function deleteRsvp(id: string) {
  const supabase = getServerSupabase()
  const { error } = await supabase.from("rsvps").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

// ----------------------------------------------------------------------
// Album (写真・動画) 管理
// ----------------------------------------------------------------------

export async function deletePost(id: string, blobUrl: string) {
  try {
    // 1. Vercel Blob からファイルを削除
    // Note: del requires the BLOB_READ_WRITE_TOKEN environment variable to be set.
    await del(blobUrl)
  } catch (error) {
    console.error("[admin action] Failed to delete from Vercel Blob:", error)
    // 続行してDBのレコードも削除する（孤立レコードを防ぐため）
  }

  // 2. Supabase からレコードを削除
  const supabase = getServerSupabase()
  const { error } = await supabase.from("posts").delete().eq("id", id)
  if (error) throw new Error(error.message)
  
  revalidatePath("/admin")
  revalidatePath("/") // トップページのアルバムも更新
}

// ----------------------------------------------------------------------
// Event Settings (イベント設定) 管理
// ----------------------------------------------------------------------

export type EventSettings = {
  event_date: string;
  event_time: string;
  venue_name: string;
  venue_address: string;
  venue_url: string;
  fee_amount: string;
  fee_note: string;
  target_audience: string;
  target_note: string;
  show_album: boolean;
}

export async function getEventSettings(): Promise<EventSettings | null> {
  const supabase = getServerSupabase()
  const { data, error } = await supabase.from("event_settings").select("*").eq("id", 1).single()
  if (error) {
    console.error("[admin action] Failed to fetch settings:", error)
    return null
  }
  return data
}

export async function updateEventSettings(data: EventSettings) {
  const supabase = getServerSupabase()
  
  // 1. 最初は全データで更新を試みる
  const { error } = await supabase.from("event_settings").upsert({ id: 1, ...data })
  
  if (error) {
    // もし "column does not exist" エラー（show_albumがない）の場合は、それを除いて再試行
    if (error.message.includes("show_album") || error.code === "42703") {
      const { show_album, ...legacyData } = data as any
      const { error: error2 } = await supabase.from("event_settings").upsert({ id: 1, ...legacyData })
      if (error2) throw new Error(error2.message)
    } else {
      throw new Error(error.message)
    }
  }
  
  revalidatePath("/")
  revalidatePath("/admin")
}

// ----------------------------------------------------------------------
// Announcements (お知らせ) 管理
// ----------------------------------------------------------------------

export async function getAnnouncements() {
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("[admin action] Failed to fetch announcements:", error)
    return []
  }
  return data || []
}

export async function getAllAnnouncements() {
  // 管理画面用：非アクティブなものも含めてすべて取得
  const supabase = getServerSupabase()
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false })
  
  if (error) throw new Error(error.message)
  return data || []
}

export async function createAnnouncement(title: string, content: string) {
  const supabase = getServerSupabase()
  const { error } = await supabase.from("announcements").insert({ title, content })
  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function toggleAnnouncementActive(id: string, is_active: boolean) {
  const supabase = getServerSupabase()
  const { error } = await supabase.from("announcements").update({ is_active }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteAnnouncement(id: string) {
  const supabase = getServerSupabase()
  const { error } = await supabase.from("announcements").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/")
  revalidatePath("/admin")
}

export async function deleteTeacherRsvp(id: string) {
  const supabase = getServerSupabase()
  const { error } = await supabase.from("teacher_rsvps").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin")
}

export type Post = {
  id: string
  type: "photo" | "video"
  url: string
  pathname: string
  content_type: string | null
  size_bytes: number | null
  uploader_name: string | null
  caption: string | null
  hidden: boolean
  created_at: string
}

export type Rsvp = {
  id: string
  name: string
  kana: string | null
  attendance: "attend" | "absent"
  message: string | null
  created_at: string
}

"use client"

import { useState, useEffect } from "react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Loader2, Users, Image as ImageIcon, Settings, LogOut, Trash2, Edit, Plus, Bell, Mail, Send } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import useSWR from "swr"
import { addRsvp, updateRsvp, deleteRsvp, deletePost, updateEventSettings, getEventSettings, getAllAnnouncements, createAnnouncement, toggleAnnouncementActive, deleteAnnouncement } from "@/app/actions/admin"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function AdminPage() {
  const { data: postsData, isLoading: isLoadingPosts, mutate: mutatePosts } = useSWR("/api/posts", fetcher)
  const { data: rsvpData, isLoading: isLoadingRsvp, mutate: mutateRsvps } = useSWR("/api/rsvp", fetcher)
  
  const [settings, setSettings] = useState<any>(null)
  const [announcements, setAnnouncements] = useState<any[]>([])
  
  const [isLoadingOther, setIsLoadingOther] = useState(true)

  const posts = postsData?.posts ?? []
  const rsvps = rsvpData?.rsvps ?? []

  useEffect(() => {
    async function fetchOtherData() {
      setIsLoadingOther(true)
      try {
        const [settingsData, announcementsData] = await Promise.all([
          getEventSettings(),
          getAllAnnouncements()
        ])
        if (settingsData) setSettings(settingsData)
        if (announcementsData) setAnnouncements(announcementsData)
      } catch (err) {
        console.error("Failed to fetch admin data", err)
      } finally {
        setIsLoadingOther(false)
      }
    }
    fetchOtherData()
  }, [])

  // State for RSVP Dialog
  const [isRsvpDialogOpen, setIsRsvpDialogOpen] = useState(false)
  const [editingRsvp, setEditingRsvp] = useState<any>(null)

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get("name") as string,
      kana: formData.get("kana") as string,
      attendance: formData.get("attendance") as string,
      guests: Number(formData.get("guests") || 0),
      message: formData.get("message") as string,
      class_number: formData.get("class_number") ? Number(formData.get("class_number")) : undefined,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
    }

    try {
      if (editingRsvp) {
        await updateRsvp(editingRsvp.id, data)
        toast.success("参加者情報を更新しました")
      } else {
        await addRsvp(data)
        toast.success("参加者を追加しました")
      }
      setIsRsvpDialogOpen(false)
      mutateRsvps()
    } catch (err: any) {
      toast.error(`エラー: ${err.message}`)
    }
  }

  const handleDeleteRsvp = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return
    try {
      await deleteRsvp(id)
      toast.success("削除しました")
      mutateRsvps()
    } catch (err: any) {
      toast.error(`エラー: ${err.message}`)
    }
  }

  const handleDeletePost = async (id: string, url: string) => {
    if (!confirm("この写真を削除しますか？\n（復元できません）")) return
    try {
      await deletePost(id, url)
      toast.success("写真を削除しました")
      mutatePosts()
    } catch (err: any) {
      toast.error(`エラー: ${err.message}`)
    }
  }

  const handleSettingsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries()) as any
    try {
      await updateEventSettings(data)
      toast.success("設定を保存しました")
      setSettings(data)
    } catch (err: any) {
      toast.error(`エラー: ${err.message}`)
    }
  }

  const handleAddAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const title = formData.get("title") as string
    const content = formData.get("content") as string
    try {
      await createAnnouncement(title, content)
      toast.success("お知らせを追加しました")
      const fresh = await getAllAnnouncements()
      setAnnouncements(fresh)
      ;(e.target as HTMLFormElement).reset()
    } catch (err: any) {
      toast.error(`エラー: ${err.message}`)
    }
  }

  const handleToggleAnnouncement = async (id: string, currentStatus: boolean) => {
    try {
      await toggleAnnouncementActive(id, !currentStatus)
      const fresh = await getAllAnnouncements()
      setAnnouncements(fresh)
    } catch (err: any) {
      toast.error(`エラー: ${err.message}`)
    }
  }

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm("本当に削除しますか？")) return
    try {
      await deleteAnnouncement(id)
      toast.success("削除しました")
      const fresh = await getAllAnnouncements()
      setAnnouncements(fresh)
    } catch (err: any) {
      toast.error(`エラー: ${err.message}`)
    }
  }

  return (
    <div className="min-h-svh bg-background flex flex-col">
      <SiteNav />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl mt-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-medium">管理者ダッシュボード</h1>
            <p className="text-muted-foreground mt-1">イベントのステータスと各種設定を行います。</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => window.location.href = "/"}>
            <LogOut className="mr-2 h-4 w-4" /> ログアウト
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid grid-cols-5 w-full h-auto gap-2 bg-muted/50 p-1">
            <TabsTrigger value="overview" className="py-2"><Users className="w-4 h-4 mr-2 hidden md:block" />概要</TabsTrigger>
            <TabsTrigger value="rsvps" className="py-2"><Users className="w-4 h-4 mr-2 hidden md:block" />名簿管理</TabsTrigger>
            <TabsTrigger value="photos" className="py-2"><ImageIcon className="w-4 h-4 mr-2 hidden md:block" />写真管理</TabsTrigger>
            <TabsTrigger value="settings" className="py-2"><Settings className="w-4 h-4 mr-2 hidden md:block" />設定</TabsTrigger>
            <TabsTrigger value="announcements" className="py-2"><Bell className="w-4 h-4 mr-2 hidden md:block" />お知らせ</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-card/50 backdrop-blur border-border/60">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">総参加表明者</CardTitle>
                  <Users className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{rsvps.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">出席: {rsvps.filter((r: any) => r.attendance === "attend").length} 名</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur border-border/60">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">アルバム投稿数</CardTitle>
                  <ImageIcon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{posts.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">写真・動画の合計</p>
                </CardContent>
              </Card>
              <Card className="bg-card/50 backdrop-blur border-border/60">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">お知らせ数</CardTitle>
                  <Bell className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{announcements.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">配信中: {announcements.filter((a) => a.is_active).length}</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-card/50 backdrop-blur border-border/60 overflow-hidden">
              <CardHeader className="border-b border-border/60 bg-muted/30">
                <CardTitle>クラス別 参加状況 (出席のみ)</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const classRsvps = rsvps.filter((r: any) => r.class_number === num && r.attendance === "attend")
                    const totalAttend = rsvps.filter((r: any) => r.attendance === "attend").length
                    const percentage = totalAttend > 0 ? (classRsvps.length / totalAttend) * 100 : 0
                    return (
                      <div key={num} className="space-y-1.5">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{num}組</span>
                          <span className="text-muted-foreground">{classRsvps.length}人</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                          <div 
                            className="h-full bg-primary transition-all" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rsvps">
            <Card className="bg-card/50 backdrop-blur border-border/60 overflow-hidden">
              <CardHeader className="border-b border-border/60 bg-muted/30 flex flex-row items-center justify-between">
                <CardTitle>参加者名簿</CardTitle>
                <Dialog open={isRsvpDialogOpen} onOpenChange={setIsRsvpDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => setEditingRsvp(null)}>
                      <Plus className="w-4 h-4 mr-2" /> 新規追加
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingRsvp ? "参加者情報の編集" : "参加者の追加"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRsvpSubmit} className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">氏名</Label>
                          <Input id="name" name="name" defaultValue={editingRsvp?.name} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="kana">ふりがな</Label>
                          <Input id="kana" name="kana" defaultValue={editingRsvp?.kana} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="class_number">3年時のクラス</Label>
                          <select id="class_number" name="class_number" defaultValue={editingRsvp?.class_number || ""} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="">選択してください</option>
                            <option value="1">1組</option>
                            <option value="2">2組</option>
                            <option value="3">3組</option>
                            <option value="4">4組</option>
                            <option value="5">5組</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="attendance">出欠</Label>
                          <select id="attendance" name="attendance" defaultValue={editingRsvp?.attendance || "attend"} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                            <option value="attend">出席</option>
                            <option value="absent">欠席</option>
                            <option value="undecided">未定</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">電話番号</Label>
                        <Input id="phone" name="phone" type="tel" defaultValue={editingRsvp?.phone} placeholder="090-1234-5678" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">メールアドレス</Label>
                        <Input id="email" name="email" type="email" defaultValue={editingRsvp?.email} placeholder="example@email.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message">メッセージ</Label>
                        <Textarea id="message" name="message" defaultValue={editingRsvp?.message} />
                      </div>
                      <DialogFooter>
                        <Button type="submit">保存する</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent className="p-0">
                {isLoadingRsvp ? (
                  <div className="flex items-center justify-center p-8 text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 読み込み中...
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>氏名</TableHead>
                        <TableHead>クラス</TableHead>
                        <TableHead>出席</TableHead>
                        <TableHead>電話番号</TableHead>
                        <TableHead>メール</TableHead>
                        <TableHead className="text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rsvps.map((rsvp: any) => (
                        <TableRow key={rsvp.id}>
                          <TableCell className="font-medium">
                            <div>{rsvp.name}</div>
                            {rsvp.kana && <div className="text-[10px] text-muted-foreground">{rsvp.kana}</div>}
                          </TableCell>
                          <TableCell>{rsvp.class_number ? `${rsvp.class_number}組` : "-"}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${rsvp.attendance === "attend" ? "bg-green-100 text-green-700" : rsvp.attendance === "absent" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>
                              {rsvp.attendance === "attend" ? "出席" : rsvp.attendance === "absent" ? "欠席" : "未定"}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm">{rsvp.phone || "-"}</TableCell>
                          <TableCell className="text-sm max-w-[160px] truncate">{rsvp.email || "-"}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => { setEditingRsvp(rsvp); setIsRsvpDialogOpen(true) }}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDeleteRsvp(rsvp.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card className="bg-card/50 backdrop-blur border-border/60">
              <CardHeader className="border-b border-border/60 bg-muted/30">
                <CardTitle>投稿写真・動画の管理</CardTitle>
                <CardDescription>不適切な写真があれば削除できます</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {posts.map((post: any) => (
                    <div key={post.id} className="relative group rounded-lg overflow-hidden border border-border aspect-square bg-muted">
                      {post.type === "photo" ? (
                        <img src={post.url} alt="" className="object-cover w-full h-full" />
                      ) : (
                        <video src={post.url} className="object-cover w-full h-full" />
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="destructive" size="sm" onClick={() => handleDeletePost(post.id, post.url)}>
                          <Trash2 className="w-4 h-4 mr-2" /> 削除
                        </Button>
                      </div>
                      <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent text-white text-xs truncate">
                        {post.uploader_name || "匿名"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="bg-card/50 backdrop-blur border-border/60">
              <CardHeader className="border-b border-border/60 bg-muted/30">
                <CardTitle>イベント設定</CardTitle>
                <CardDescription>トップページや開催概要に表示される基本情報を変更します。</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {isLoadingOther ? (
                  <div className="flex items-center justify-center p-8"><Loader2 className="animate-spin w-6 h-6" /></div>
                ) : (
                  <form onSubmit={handleSettingsSubmit} className="space-y-6 max-w-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="event_date">日程</Label>
                        <Input id="event_date" name="event_date" defaultValue={settings?.event_date || "2027年1月9日（土）"} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="event_time">時間（サブテキスト）</Label>
                        <Input id="event_time" name="event_time" defaultValue={settings?.event_time || "15:00 開宴"} required />
                      </div>
                    </div>
                    
                    <div className="space-y-4 border p-4 rounded-lg">
                      <h3 className="font-medium text-sm">会場設定</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="venue_name">会場名</Label>
                          <Input id="venue_name" name="venue_name" defaultValue={settings?.venue_name || "パレスホテル掛川"} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="venue_url">会場URL</Label>
                          <Input id="venue_url" name="venue_url" defaultValue={settings?.venue_url || "https://breezbay-group.com/kakegawa-ph/"} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="venue_address">会場住所</Label>
                        <Input id="venue_address" name="venue_address" defaultValue={settings?.venue_address || "静岡県掛川市亀の甲2-8-15"} required />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fee_amount">会費</Label>
                        <Input id="fee_amount" name="fee_amount" defaultValue={settings?.fee_amount || "8,000円"} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fee_note">会費の注記</Label>
                        <Input id="fee_note" name="fee_note" defaultValue={settings?.fee_note || "当日受付にて現金でお支払い"} required />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">設定を保存してトップページに反映</Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements">
            <Card className="bg-card/50 backdrop-blur border-border/60">
              <CardHeader className="border-b border-border/60 bg-muted/30">
                <CardTitle>お知らせ管理</CardTitle>
                <CardDescription>トップページ上部に表示されるお知らせを配信します。</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-4">新規お知らせ投稿</h3>
                    <form onSubmit={handleAddAnnouncement} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">タイトル</Label>
                        <Input id="title" name="title" placeholder="例: 会費の支払い方法について" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="content">本文</Label>
                        <Textarea id="content" name="content" placeholder="お知らせの詳細を入力..." className="h-32" required />
                      </div>
                      <Button type="submit" className="w-full">お知らせを配信する</Button>
                    </form>
                  </div>
                
                <div>
                  <h3 className="font-medium mb-4">配信履歴</h3>
                  {isLoadingOther ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : announcements.length === 0 ? (
                    <p className="text-sm text-muted-foreground">お知らせはありません</p>
                  ) : (
                    <div className="space-y-4">
                      {announcements.map((a) => (
                        <div key={a.id} className={`p-4 rounded-lg border ${a.is_active ? 'bg-primary/5 border-primary/20' : 'bg-muted border-border/50'}`}>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{a.title}</h4>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">表示</span>
                              <Switch 
                                checked={a.is_active} 
                                onCheckedChange={() => handleToggleAnnouncement(a.id, a.is_active)} 
                              />
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground whitespace-pre-wrap">{a.content}</p>
                          <div className="mt-4 flex justify-between items-center text-xs text-muted-foreground">
                            <span>{new Date(a.created_at).toLocaleDateString("ja-JP")}</span>
                            <Button variant="ghost" size="sm" className="h-6 px-2 text-red-500 hover:text-red-600" onClick={() => handleDeleteAnnouncement(a.id)}>
                              削除
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                </div>

                {/* リマインドメール */}
                <div className="border-t border-border/60 pt-6">
                  <h3 className="font-medium mb-1">リマインドメール一斉送信</h3>
                  <p className="text-sm text-muted-foreground mb-4">出席予定者全員にメールを一括送信します。</p>
                  <ReminderEmailForm />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />
    </div>
  )
}

function ReminderEmailForm() {
  const [sending, setSending] = useState(false)
  const [subject, setSubject] = useState("【成人式のご案内】開催のリマインド")
  const [body, setBody] = useState("このたびは出席のご回答をいただきありがとうございます。\n\nイベントの詳細は以下の通りです。\n\n■ 日時: 2027年1月9日（土）15:00〜\n■ 会場: パレスホテル掛川\n■ 会費: 8,000円（当日受付にて現金）\n\nご不明な点がございましたら、お気軽にご連絡ください。\n当日皆さんにお会いできることを楽しみにしております。")

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!confirm("出席予定者全員にリマインドメールを送信しますか？")) return
    setSending(true)
    try {
      const res = await fetch("/api/send-reminder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, body }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error ?? "送信に失敗しました")
      toast.success(json.message)
    } catch (err: any) {
      toast.error(`エラー: ${err.message}`)
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSend} className="space-y-4 max-w-2xl">
      <div className="space-y-2">
        <Label>件名</Label>
        <Input value={subject} onChange={(e) => setSubject(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label>本文</Label>
        <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="h-48" required />
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button type="submit" disabled={sending} className="gap-2">
          {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          {sending ? "送信中..." : "出席予定者全員に送信"}
        </Button>
        <p className="text-xs text-muted-foreground">※ Resend APIキーの設定が必要です</p>
      </div>
    </form>
  )
}

-- 同窓会サイト 初期スキーマ
-- RSVP（出欠回答）と Posts（写真・動画投稿）を保存する2テーブル

-- 1. RSVP テーブル
create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kana text,
  attendance text not null check (attendance in ('attend', 'absent', 'undecided')),
  guests integer not null default 0 check (guests >= 0 and guests <= 5),
  message text,
  created_at timestamptz not null default now()
);

create index if not exists idx_rsvps_created_at on public.rsvps (created_at desc);

-- 2. Posts テーブル（写真・動画のメタデータ）
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('photo', 'video')),
  url text not null,
  pathname text not null,
  content_type text,
  size_bytes bigint,
  uploader_name text,
  caption text,
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_posts_created_at on public.posts (created_at desc);
create index if not exists idx_posts_visible on public.posts (hidden, created_at desc);

-- RLS は使わず、サーバー側 (service role key) でのみ書き込みする運用にします。
-- 認証なしでURL公開する設計のため、anon key からの直接アクセスはブロックします。
alter table public.rsvps enable row level security;
alter table public.posts enable row level security;

-- 既存ポリシーを安全に削除してから作り直し
drop policy if exists "no anon read rsvps" on public.rsvps;
drop policy if exists "no anon write rsvps" on public.rsvps;
drop policy if exists "public read posts" on public.posts;
drop policy if exists "no anon write posts" on public.posts;

-- posts は表示用に anon でも read 可能（hidden=false のみ実用）
create policy "public read posts"
  on public.posts for select
  to anon, authenticated
  using (hidden = false);

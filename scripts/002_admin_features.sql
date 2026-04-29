-- 同窓会サイト 管理機能追加用スキーマ

-- 1. イベント設定テーブル
-- (シングルトンパターンを想定：常にID=1の行だけを使う)
create table if not exists public.event_settings (
  id integer primary key default 1 check (id = 1),
  event_date text not null default '2027年1月9日（土）',
  event_time text not null default '15:00 開宴',
  venue_name text not null default 'パレスホテル掛川',
  venue_address text not null default '静岡県掛川市亀の甲2-8-15',
  venue_url text default 'https://breezbay-group.com/kakegawa-ph/',
  fee_amount text not null default '8,000円',
  fee_note text not null default '当日受付にて現金でお支払い',
  target_audience text not null default '掛川北中学校 卒業生',
  target_note text not null default '27年度二十歳の集い 参加者',
  updated_at timestamptz not null default now()
);

-- 初期データの挿入（既存のデータがない場合のみ）
insert into public.event_settings (id) values (1) on conflict (id) do nothing;

-- 2. お知らせテーブル
create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_announcements_created_at on public.announcements (created_at desc);
create index if not exists idx_announcements_active on public.announcements (is_active, created_at desc);

-- RLS は使わず、サーバー側 (service role key) でのみ読み書きする運用にします。
-- (設定とお知らせの読み込みは全てサーバーコンポーネントかAPI経由で行います)
alter table public.event_settings enable row level security;
alter table public.announcements enable row level security;

-- 既存のRsvpsテーブルへのカラム追加（もしまだ実行していなければ）
alter table public.rsvps add column if not exists class_number integer;

-- 生徒フォームに性別カラムを追加
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS gender text; -- 'male' | 'female'

-- 先生用テーブル（生徒とは別集計）
CREATE TABLE IF NOT EXISTS public.teacher_rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  kana text,
  subject text,
  attendance text not null default 'attend',
  message text,
  phone text,
  email text,
  created_at timestamptz not null default now()
);

-- RLS有効化（サーバー側のみ読み書き）
ALTER TABLE public.teacher_rsvps ENABLE ROW LEVEL SECURITY;

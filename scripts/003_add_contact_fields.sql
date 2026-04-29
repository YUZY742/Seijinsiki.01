-- 連絡先カラム追加
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.rsvps ADD COLUMN IF NOT EXISTS email text;

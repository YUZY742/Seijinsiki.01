-- イベント設定にアルバム表示フラグを追加
ALTER TABLE public.event_settings ADD COLUMN IF NOT EXISTS show_album boolean DEFAULT true;

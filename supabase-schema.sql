-- Watches table: stores all watch data
CREATE TABLE IF NOT EXISTS watches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  reference_number TEXT NOT NULL,
  image_url TEXT,
  movement TEXT,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User collection table: links users to watches (owned / wishlist)
CREATE TABLE IF NOT EXISTS user_collection (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  watch_id UUID NOT NULL REFERENCES watches(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('owned', 'wishlist')) DEFAULT 'wishlist',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, watch_id)
);

-- Wristchecks table: stores wristcheck photo uploads
CREATE TABLE IF NOT EXISTS wristchecks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  watch_model TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_collection ENABLE ROW LEVEL SECURITY;
ALTER TABLE wristchecks ENABLE ROW LEVEL SECURITY;

-- Watches: everyone can read
CREATE POLICY "Watches are viewable by everyone" ON watches
  FOR SELECT USING (true);

-- User collection: users can manage their own collection
CREATE POLICY "Users can view their own collection" ON user_collection
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own collection" ON user_collection
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own collection" ON user_collection
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own collection" ON user_collection
  FOR UPDATE USING (auth.uid() = user_id);

-- Wristchecks: everyone can read, users can create their own
CREATE POLICY "Wristchecks are viewable by everyone" ON wristchecks
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own wristchecks" ON wristchecks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wristchecks" ON wristchecks
  FOR DELETE USING (auth.uid() = user_id);

-- Create storage bucket for wristcheck images
INSERT INTO storage.buckets (id, name, public)
VALUES ('wristchecks', 'wristchecks', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Wristcheck images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'wristchecks');

CREATE POLICY "Authenticated users can upload wristcheck images" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'wristchecks' AND auth.role() = 'authenticated');

CREATE POLICY "Users can delete their own wristcheck images" ON storage.objects
  FOR DELETE USING (bucket_id = 'wristchecks' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Seed data: sample watches
INSERT INTO watches (brand, model, reference_number, image_url, movement, category) VALUES
  ('Rolex', 'Submariner Date', '126610LN', 'https://images.unsplash.com/photo-1622434641406-a158123450f9?w=400', 'Automatic (Cal. 3235)', 'Dive Watch'),
  ('Rolex', 'Daytona', '116500LN', 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400', 'Automatic (Cal. 4130)', 'Chronograph'),
  ('Omega', 'Speedmaster Moonwatch', '310.30.42.50.01.001', 'https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=400', 'Manual (Cal. 3861)', 'Chronograph'),
  ('Omega', 'Seamaster 300M', '210.30.42.20.01.001', 'https://images.unsplash.com/photo-1612817159949-195b6eb9e31a?w=400', 'Automatic (Cal. 8800)', 'Dive Watch'),
  ('Tudor', 'Black Bay 58', 'M79030N-0001', 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=400', 'Automatic (Cal. MT5402)', 'Dive Watch'),
  ('Seiko', 'Presage Cocktail Time', 'SRPB41J1', 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400', 'Automatic (Cal. 4R35)', 'Dress Watch'),
  ('Casio', 'G-Shock GA-2100', 'GA-2100-1A1ER', 'https://images.unsplash.com/photo-1533139502658-0198f920d8e8?w=400', 'Quartz', 'Sport Watch'),
  ('TAG Heuer', 'Carrera Chronograph', 'CBS2210.FC6534', 'https://images.unsplash.com/photo-1587925358603-c2eea5305bbc?w=400', 'Automatic (Cal. TH20-00)', 'Chronograph'),
  ('IWC', 'Portugieser Chronograph', 'IW371605', 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400', 'Automatic (Cal. 69355)', 'Chronograph'),
  ('Patek Philippe', 'Nautilus', '5711/1A-010', 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400', 'Automatic (Cal. 26-330 SC)', 'Sport Watch'),
  ('Audemars Piguet', 'Royal Oak', '15500ST.OO.1220ST.01', 'https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?w=400', 'Automatic (Cal. 4302)', 'Sport Watch'),
  ('Jaeger-LeCoultre', 'Reverso Classic', 'Q3858520', 'https://images.unsplash.com/photo-1508057198894-247b23fe5ade?w=400', 'Manual (Cal. 822/2)', 'Dress Watch')
ON CONFLICT DO NOTHING;

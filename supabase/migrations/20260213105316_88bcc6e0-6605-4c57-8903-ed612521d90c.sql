
-- Create love_calculations table
CREATE TABLE public.love_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name1 TEXT NOT NULL,
  name2 TEXT NOT NULL,
  love_score INTEGER NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public inserts and reads (no auth needed for a fun app)
ALTER TABLE public.love_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert love calculations"
ON public.love_calculations
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can view love calculations"
ON public.love_calculations
FOR SELECT
USING (true);

-- Create storage bucket for couple photos
INSERT INTO storage.buckets (id, name, public) VALUES ('couple-photos', 'couple-photos', true);

CREATE POLICY "Anyone can upload couple photos"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'couple-photos');

CREATE POLICY "Anyone can view couple photos"
ON storage.objects
FOR SELECT
USING (bucket_id = 'couple-photos');

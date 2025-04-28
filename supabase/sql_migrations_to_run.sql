
-- Add new columns to host_profiles table if they don't already exist
ALTER TABLE public.host_profiles ADD COLUMN IF NOT EXISTS subscription_tier text;
ALTER TABLE public.host_profiles ADD COLUMN IF NOT EXISTS subscription_plan_type text DEFAULT 'venue';

-- Add new column to subscription_transactions if it doesn't already exist
ALTER TABLE public.subscription_transactions ADD COLUMN IF NOT EXISTS plan_type text DEFAULT 'venue';

-- Create the subscription pauses table
CREATE TABLE IF NOT EXISTS public.subscription_pauses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  subscription_id TEXT NOT NULL,
  days_paused INTEGER NOT NULL CHECK (days_paused > 0 AND days_paused <= 14),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'canceled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add Row Level Security to subscription_pauses table
ALTER TABLE public.subscription_pauses ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own pauses
CREATE POLICY "Users can view own pauses" ON public.subscription_pauses
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow edge functions to insert/update pauses
CREATE POLICY "Edge functions can manage pauses" ON public.subscription_pauses
  FOR ALL
  USING (true);

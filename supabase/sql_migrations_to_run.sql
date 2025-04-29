
-- Remove plan_type column if it exists in host_profiles
ALTER TABLE public.host_profiles DROP COLUMN IF EXISTS subscription_plan_type;

-- Remove plan_type column if it exists in subscription_transactions
ALTER TABLE public.subscription_transactions DROP COLUMN IF EXISTS plan_type;

-- Add a billing_mode column to subscription_transactions to indicate whether it's a one-time or recurring subscription
ALTER TABLE public.subscription_transactions ADD COLUMN IF NOT EXISTS billing_mode text DEFAULT 'subscription';

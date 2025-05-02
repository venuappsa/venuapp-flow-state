
-- Remove plan_type column if it exists in host_profiles
ALTER TABLE public.host_profiles DROP COLUMN IF EXISTS subscription_plan_type;

-- Remove plan_type column if it exists in subscription_transactions
ALTER TABLE public.subscription_transactions DROP COLUMN IF EXISTS plan_type;

-- Add a billing_mode column to subscription_transactions to indicate whether it's a one-time or recurring subscription
ALTER TABLE public.subscription_transactions ADD COLUMN IF NOT EXISTS billing_mode text DEFAULT 'subscription';

-- Set up a cron job to run the maintenance function daily at midnight
SELECT cron.schedule(
  'daily-maintenance-job',
  '0 0 * * *',  -- Cron expression: At midnight (00:00) every day
  $$
  SELECT 
    net.http_post(
      url:='https://xugrsxymeyrfyqdeirjc.supabase.co/functions/v1/maintenance-cron',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1Z3JzeHltZXlyZnlxZGVpcmpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU1OTYyMzMsImV4cCI6MjA2MTE3MjIzM30.8qY3X6lvZZHa-UJHm2htWJq3zAMJTyuSnamdzHHdmGI"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);

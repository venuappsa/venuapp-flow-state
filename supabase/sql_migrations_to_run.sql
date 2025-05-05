
-- Remove plan_type column if it exists in host_profiles
ALTER TABLE public.host_profiles DROP COLUMN IF EXISTS subscription_plan_type;

-- Remove plan_type column if it exists in subscription_transactions
ALTER TABLE public.subscription_transactions DROP COLUMN IF EXISTS plan_type;

-- Add a billing_mode column to subscription_transactions to indicate whether it's a one-time or recurring subscription
ALTER TABLE public.subscription_transactions ADD COLUMN IF NOT EXISTS billing_mode text DEFAULT 'subscription';

-- Create a function to refresh PostgREST's schema cache
CREATE OR REPLACE FUNCTION public.postgrest_schema_cache_refresh()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  NOTIFY pgrst, 'reload schema';
END;
$$;

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

-- Verify that the functions we need exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'postgrest_schema_cache_refresh') THEN
    RAISE NOTICE 'PostgREST schema cache refresh function not found!';
  END IF;
  
  -- Create a function to check and fix any fetchman profiles without corresponding user profiles
  CREATE OR REPLACE FUNCTION public.repair_fetchman_profiles()
  RETURNS TABLE(
    fixed_count int,
    error_count int,
    details text[]
  )
  LANGUAGE plpgsql
  AS $$
  DECLARE
    missing_profiles_count int := 0;
    error_count int := 0;
    result_details text[] := ARRAY[]::text[];
    missing_profile record;
    auth_user record;
  BEGIN
    -- Find fetchman profiles without corresponding profiles
    FOR missing_profile IN
      SELECT fp.user_id
      FROM public.fetchman_profiles fp
      LEFT JOIN public.profiles p ON fp.user_id = p.id
      WHERE p.id IS NULL
    LOOP
      BEGIN
        -- Get user data from auth.users
        SELECT id, email, raw_user_meta_data->>'name' as name, raw_user_meta_data->>'surname' as surname
        INTO auth_user
        FROM auth.users
        WHERE id = missing_profile.user_id;
        
        IF auth_user.id IS NOT NULL THEN
          -- Insert the missing profile
          INSERT INTO public.profiles (id, email, name, surname)
          VALUES (
            auth_user.id,
            auth_user.email,
            auth_user.name,
            auth_user.surname
          );
          
          missing_profiles_count := missing_profiles_count + 1;
          result_details := array_append(result_details, 'Fixed profile for user: ' || auth_user.id);
        ELSE
          error_count := error_count + 1;
          result_details := array_append(result_details, 'User not found in auth: ' || missing_profile.user_id);
        END IF;
      EXCEPTION WHEN OTHERS THEN
        error_count := error_count + 1;
        result_details := array_append(result_details, 'Error: ' || SQLERRM || ' for user: ' || missing_profile.user_id);
      END;
    END LOOP;
    
    RETURN QUERY SELECT missing_profiles_count, error_count, result_details;
  END;
  $$;
END
$$;

-- Run the repair function to fix any existing issues
SELECT * FROM public.repair_fetchman_profiles();

-- Notify PostgREST to reload the schema after all these changes
SELECT public.postgrest_schema_cache_refresh();

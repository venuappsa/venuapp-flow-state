
-- Function to check for foreign key constraints
CREATE OR REPLACE FUNCTION public.check_foreign_key_constraints()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  has_fetchman_fk boolean;
  has_user_roles_fk boolean;
  result json;
BEGIN
  -- Check for fetchman_profiles foreign key
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'fetchman_profiles'
      AND ccu.table_name = 'profiles'
  ) INTO has_fetchman_fk;

  -- Check for user_roles foreign key
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.table_constraints tc
    JOIN information_schema.constraint_column_usage ccu ON tc.constraint_name = ccu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_name = 'user_roles'
      AND ccu.table_name = 'profiles'
  ) INTO has_user_roles_fk;

  -- Construct and return the result
  result := json_build_object(
    'has_fetchman_constraint', has_fetchman_fk,
    'has_role_constraint', has_user_roles_fk
  );
  
  RETURN result;
END;
$$;

-- Function to check if the profile creation trigger exists
CREATE OR REPLACE FUNCTION public.check_trigger_exists()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  trigger_exists boolean;
  result json;
BEGIN
  -- Check if the trigger exists
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.triggers
    WHERE trigger_name = 'ensure_profile_before_insert'
  ) INTO trigger_exists;

  -- Construct and return the result
  result := json_build_object(
    'exists', trigger_exists
  );
  
  RETURN result;
END;
$$;


// Type definitions for the RPC functions related to user management

export interface CheckUserResult {
  auth_user_exists: boolean;
  profile_exists: boolean;
  fetchman_profile_exists: boolean;
  user_id: string;
  fetchman_profile_id: string | null;
  roles: string[] | null;
}

export interface DeleteUserResult {
  success: boolean;
  message: string;
  deleted_items?: Record<string, number>;
  user_id?: string;
  fetchman_profile_id?: string | null;
}

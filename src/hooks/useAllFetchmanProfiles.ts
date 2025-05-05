
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FetchmanProfile } from '@/types/fetchman';
import { useToast } from '@/components/ui/use-toast';

export type { FetchmanProfile };  // Fixed: Using 'export type' for isolatedModules

export const useAllFetchmanProfiles = (filters?: { status?: string }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const fetchProfiles = async (): Promise<FetchmanProfile[]> => {
    let query = supabase
      .from('fetchman_profiles')
      .select(`
        *,
        user:profiles(*)
      `)
      .order('created_at', { ascending: false });
    
    // Apply filters if provided
    if (filters?.status) {
      query = query.eq('verification_status', filters.status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;

    // Transform the data to match our type definition
    const transformedData: FetchmanProfile[] = data?.map(item => ({
      ...item,
      // Convert work_areas to string[] if it's a string
      work_areas: Array.isArray(item.work_areas) ? item.work_areas : 
                  typeof item.work_areas === 'string' ? JSON.parse(item.work_areas) : 
                  item.work_areas || [],
      // Convert mobility_preference to Record<string, boolean> if it's a string
      mobility_preference: typeof item.mobility_preference === 'string' ? 
                          JSON.parse(item.mobility_preference) : 
                          item.mobility_preference || {}
    })) || [];
    
    return transformedData;
  };

  // Mutation for updating fetchman status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, reason }: { id: string; status: string; reason?: string }) => {
      const { data, error } = await supabase
        .from('fetchman_profiles')
        .update({ verification_status: status })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchman-profiles'] });
      toast({
        title: 'Status updated',
        description: 'Fetchman status has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating status',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for promoting a fetchman
  const promoteMutation = useMutation({
    mutationFn: async ({ id, role, notes }: { id: string; role: string; notes?: string }) => {
      // First, update the fetchman_profiles table with the new role
      const { data: updatedProfile, error: profileError } = await supabase
        .from('fetchman_profiles')
        .update({ role })
        .eq('id', id)
        .select()
        .single();
      
      if (profileError) throw profileError;
      
      // Next, record the promotion in the fetchman_promotions table
      const { data: userId } = await supabase.auth.getUser();
      if (!userId.user) throw new Error('User not authenticated');
      
      const { error: promotionError } = await supabase
        .from('fetchman_promotions')
        .insert({
          fetchman_id: id,
          promoted_by: userId.user.id,
          previous_role: updatedProfile.role,
          new_role: role,
          notes,
        });
      
      if (promotionError) throw promotionError;
      
      return updatedProfile;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchman-profiles'] });
      toast({
        title: 'Promotion successful',
        description: 'Fetchman has been promoted to a new role.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error promoting fetchman',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for creating a new assignment
  const createAssignmentMutation = useMutation({
    mutationFn: async ({
      fetchmanId,
      entityId,
      entityType,
      startDate,
      endDate,
      notes,
    }: {
      fetchmanId: string;
      entityId: string;
      entityType: string;
      startDate: string | Date;
      endDate: string | Date;
      notes?: string;
    }) => {
      const { data: userId } = await supabase.auth.getUser();
      if (!userId.user) throw new Error('User not authenticated');
      
      const start = typeof startDate === 'string' ? startDate : startDate.toISOString();
      const end = typeof endDate === 'string' ? endDate : endDate.toISOString();
      
      const { data, error } = await supabase
        .from('fetchman_assignments')
        .insert({
          fetchman_id: fetchmanId,
          entity_id: entityId,
          entity_type: entityType,
          start_date: start,
          end_date: end,
          assigned_by: userId.user.id,
          notes,
          status: 'upcoming',
        })
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fetchman-assignments'] });
      toast({
        title: 'Assignment created',
        description: 'New assignment has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating assignment',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Function to test profile relationships
  const testProfilesRelationship = async () => {
    try {
      // First, get all profile IDs
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id');
      
      if (profilesError) {
        return {
          success: false,
          message: `Error fetching profiles: ${profilesError.message}`,
          error: profilesError,
        };
      }
      
      // Create an array of profile IDs
      const profileIds = profilesData ? profilesData.map(p => p.id) : [];
      
      // Check if there are any fetchman profiles without corresponding user profiles
      let query;
      if (profileIds.length === 0) {
        // If no profiles found, check all fetchman profiles
        query = supabase
          .from('fetchman_profiles')
          .select('id, user_id');
      } else if (profileIds.length === 1) {
        // If only one profile found, use .neq instead of .not(..).in 
        // This fixes the "failed to parse filter (not.in.[single-uuid])" error
        query = supabase
          .from('fetchman_profiles')
          .select('id, user_id')
          .neq('user_id', profileIds[0]);
      } else {
        // For multiple profiles, use the not-in filter as before
        query = supabase
          .from('fetchman_profiles')
          .select('id, user_id')
          .not('user_id', 'in', profileIds);
      }
      
      const { data: orphanedProfiles, error } = await query;
      
      if (error) {
        return {
          success: false,
          message: `Error checking profile relationships: ${error.message}`,
          error,
        };
      }
      
      if (orphanedProfiles && orphanedProfiles.length > 0) {
        return {
          success: true,
          message: `Found ${orphanedProfiles.length} fetchman profiles without corresponding user profiles.`,
          orphanedData: orphanedProfiles,
        };
      }
      
      return {
        success: true,
        message: 'All fetchman profiles have corresponding user profiles.',
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Error in relationship test: ${error.message}`,
        error,
      };
    }
  };

  const { data = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['fetchman-profiles'],
    queryFn: fetchProfiles,
  });

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
    testProfilesRelationship,
    // Add the methods needed for AdminFetchmanPage
    fetchmen: data,
    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,
    promote: promoteMutation.mutate,
    isPromoting: promoteMutation.isPending,
    createAssignment: createAssignmentMutation.mutate,
    isCreatingAssignment: createAssignmentMutation.isPending
  };
};

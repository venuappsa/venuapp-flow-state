import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle, Loader, Trash, UserX } from "lucide-react";
import { useUserDeletion } from "@/hooks/useUserDeletion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DeleteUserResult } from "@/types/user-management";

interface UserDeletionManagerProps {
  onSuccessfulDeletion?: () => void;
  defaultUserId?: string;
}

export const UserDeletionManager: React.FC<UserDeletionManagerProps> = ({ 
  onSuccessfulDeletion,
  defaultUserId = ""
}) => {
  const [userId, setUserId] = useState<string>(defaultUserId);
  const [showConfirmDialog, setShowConfirmDialog] = useState<boolean>(false);
  const [deletionResult, setDeletionResult] = useState<DeleteUserResult | null>(null);
  const { isChecking, isDeleting, userDetails, checkUserExists, deleteFetchmanUser } = useUserDeletion();
  const { toast } = useToast();

  const handleUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserId(e.target.value.trim());
    // Reset user details when ID changes
    if (userDetails) {
      // No need to actually setUserDetails(null) here as that would remove the UI,
      // we'll just let it update when they check the new ID
    }
  };

  const handleCheckUser = async () => {
    if (!userId) {
      toast({
        title: "Error",
        description: "Please enter a valid user ID",
        variant: "destructive"
      });
      return;
    }
    
    const result = await checkUserExists(userId);
    
    if (result) {
      // If user doesn't exist in any system, show a toast
      if (!result.auth_user_exists && !result.profile_exists && !result.fetchman_profile_exists) {
        toast({
          title: "User Not Found",
          description: `No user with ID ${userId} exists in any system tables`,
          variant: "destructive"
        });
      }
    }
  };

  const handleDeleteConfirmation = () => {
    if (userDetails) {
      setShowConfirmDialog(true);
    }
  };

  const handleDelete = async () => {
    setShowConfirmDialog(false);
    
    if (!userDetails) return;
    
    const result = await deleteFetchmanUser(userId);
    setDeletionResult(result);
    
    if (result && result.success) {
      toast({
        title: "Success",
        description: "User deleted successfully from all systems",
        variant: "default"
      });
      
      // Clear the input field
      setUserId("");
      
      // Notify parent component if callback is provided
      if (onSuccessfulDeletion) {
        onSuccessfulDeletion();
      }
    } else {
      toast({
        title: "Deletion Error",
        description: result ? result.message : "Unknown error during deletion",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserX className="h-5 w-5" />
          User Deletion Manager
        </CardTitle>
        <CardDescription>
          Check and delete user accounts completely from the system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input 
              value={userId}
              onChange={handleUserIdChange}
              placeholder="Enter user ID"
              className="flex-1"
            />
            <Button
              onClick={handleCheckUser}
              disabled={isChecking || !userId}
            >
              {isChecking ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Checking
                </>
              ) : (
                "Check User"
              )}
            </Button>
          </div>

          {userDetails && (
            <Alert variant={userDetails.auth_user_exists || userDetails.profile_exists ? "default" : "destructive"}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>User Details</AlertTitle>
              <AlertDescription>
                <div className="pt-2 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div>User ID:</div>
                    <div className="font-mono text-xs break-all">{userDetails.user_id}</div>
                    
                    <div>Auth User:</div>
                    <div>{userDetails.auth_user_exists ? (
                      <Badge variant="success" className="bg-green-500">Exists</Badge>
                    ) : (
                      <Badge variant="destructive">Not Found</Badge>
                    )}</div>
                    
                    <div>Profile:</div>
                    <div>{userDetails.profile_exists ? (
                      <Badge variant="success" className="bg-green-500">Exists</Badge>
                    ) : (
                      <Badge variant="destructive">Not Found</Badge>
                    )}</div>
                    
                    <div>Fetchman Profile:</div>
                    <div>{userDetails.fetchman_profile_exists ? (
                      <Badge variant="success" className="bg-green-500">Exists</Badge>
                    ) : (
                      <Badge variant="destructive">Not Found</Badge>
                    )}</div>

                    {userDetails.fetchman_profile_exists && (
                      <>
                        <div>Fetchman Profile ID:</div>
                        <div className="font-mono text-xs break-all">{userDetails.fetchman_profile_id}</div>
                      </>
                    )}
                    
                    {userDetails.roles && userDetails.roles.length > 0 && (
                      <>
                        <div>User Roles:</div>
                        <div className="flex flex-wrap gap-1">
                          {userDetails.roles.map((role, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {(userDetails.auth_user_exists || userDetails.profile_exists || userDetails.fetchman_profile_exists) && (
                    <Button 
                      variant="destructive"
                      className="mt-2"
                      onClick={handleDeleteConfirmation}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Delete User
                    </Button>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {deletionResult && (
            <Alert variant={deletionResult.success ? "default" : "destructive"}>
              {deletionResult.success ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {deletionResult.success ? "Deletion Successful" : "Deletion Error"}
              </AlertTitle>
              <AlertDescription>
                <div className="pt-2 space-y-2">
                  <p>{deletionResult.message}</p>
                  
                  {deletionResult.deleted_items && (
                    <>
                      <Separator className="my-2" />
                      <div className="text-sm font-medium">Deleted Items:</div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {Object.entries(deletionResult.deleted_items).map(([table, count]) => (
                          <React.Fragment key={table}>
                            <div className="text-sm">{table}:</div>
                            <div className="text-sm font-mono">{count}</div>
                          </React.Fragment>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm User Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This will permanently delete:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {userDetails?.auth_user_exists && (
                    <li>User authentication account</li>
                  )}
                  {userDetails?.profile_exists && (
                    <li>User profile data</li>
                  )}
                  {userDetails?.fetchman_profile_exists && (
                    <li>Fetchman profile and related data</li>
                  )}
                  <li>All related records and history</li>
                </ul>
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Confirm Deletion"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

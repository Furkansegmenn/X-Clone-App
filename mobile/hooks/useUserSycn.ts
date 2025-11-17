import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient, userApi } from "../utils/api";


export const useUserSync = () =>{
    const { isSignedIn } = useAuth();
    const api = useApiClient();

    const syncUserMutation = useMutation({
        mutationFn: () => userApi.syncUser(api),
        onSuccess: (response: any) => console.log("User synced successfully:", response.data.user),
        onError: (error: any) => {
            console.error("User sync failed:");
            console.error("Error message:", error.message);
            console.error("Error response:", error.response?.data);
            console.error("Error status:", error.response?.status);
            console.error("API URL:", error.config?.url);
        }
    })

    useEffect(() => {
        // if user is signed in and user is not synced yet, sync user
        if (isSignedIn && !syncUserMutation.data) {
          syncUserMutation.mutate();
        }
      }, [isSignedIn]);
}
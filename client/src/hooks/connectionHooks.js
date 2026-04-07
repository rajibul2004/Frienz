import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { connectionApis } from "../api/connectionApis";

export const connectionHooks = {
    // Accept friend request
    useAcceptFR: () => {
        const queryClient = useQueryClient();

        const { mutateAsync, isPending, error } = useMutation({
            mutationFn: connectionApis.acceptFriendRequest,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["friend-requests"] });
                queryClient.invalidateQueries({ queryKey: ["friends"] });
                queryClient.invalidateQueries({ queryKey: ["recommended-users"] });
            }
        });
        return { error, isAcceptPending: isPending, acceptMutation: mutateAsync }; // Renamed
    },

    // Send friend request
    useSendFR: () => {
        const queryClient = useQueryClient();
        const { mutateAsync, isPending, error } = useMutation({
            mutationFn: connectionApis.sendFriendRequest, // Fixed typo
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["outgoing-friend-requests"] });
                queryClient.invalidateQueries({ queryKey: ["recommended-users"] });
            }
        });
        return { error, isPending, sendFRMutation: mutateAsync };
    },


    // Get incoming friend requests
    useGetIncomingFR: () => {
        const { data, isLoading, error } = useQuery({
            queryKey: ["friend-requests"], // Renamed for clarity
            queryFn: connectionApis.getIncomingFR,
            retry: false,
            staleTime: 1 * 60 * 1000 // 1 minute
        });
        return { 
            isLoading, 
            requests: data?.data,
            error 
        };
    },

    // Get outgoing friend requests
    useGetOutgoingFR: () => {
        const { data, isLoading, error } = useQuery({
            queryKey: ["outgoing-friend-requests"],
            queryFn: connectionApis.getOutgoingFR,
            retry: false,
            staleTime: 1 * 60 * 1000
        });
        return { 
            isLoading,
            outgoingRequests: data?.outGoingReq || [], // Fixed field name
            error 
        };
    },

    // Get recommended users
    useGetRecommendation: () => {
        const { isLoading, data, error } = useQuery({
            queryKey: ["recommended-users"],
            queryFn: connectionApis.getRecommendation,
            retry: false,
            staleTime: 10 * 60 * 1000, // 10 minutes
        });
        return { 
            isLoading, 
            recommendedUsers: data|| [], 
            error 
        };
    },

        // Get friends list
    useGetFriends: () => {
        const { data, isLoading, error } = useQuery({
            queryKey: ["friends"],
            queryFn: connectionApis.getFriends,
            retry: false,
            staleTime: 5 * 60 * 1000, // 5 minutes
            select: (response) => response.friends || [] 
        });
        return { 
            isLoading, 
            friends: data || [],
            error 
        };
    },
    useRemoveFriend:()=>{
        const queryClient = useQueryClient();   
        const { mutateAsync, isPending, error } = useMutation({
            mutationFn: connectionApis.removeFriend,
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["friends"] });
                queryClient.invalidateQueries({ queryKey: ["recommended-users"] });
            }
        });
        return { error, isPending, removeFriendMutation: mutateAsync };
    }   
};
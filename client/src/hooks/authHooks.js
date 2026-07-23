import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { authApis } from '../api/authApis'
import { disconnectSocket } from "../lib/socket";
export const authHooks = {
    useLogin: () => {
        const queryClient = useQueryClient();
        const { mutateAsync, isPending, error } = useMutation({
            mutationFn: authApis.login,
            onSuccess: (data) => {
                // Immediately populate the cache so PrivateRoute never sees a missing user
                if (data?.user) {
                    queryClient.setQueryData(["user"], data.user);
                } else {
                    queryClient.invalidateQueries({ queryKey: ["user"] });
                }
            }
        });
        return { error, isLoginPending: isPending, loginMutation: mutateAsync };
    },

    useRegister: () => {
        const queryClient = useQueryClient();
        const { mutateAsync, isPending, error } = useMutation({
            mutationFn: authApis.register,
            onSuccess: (data) => {
                // Immediately populate the cache so PrivateRoute never sees a missing user
                if (data?.user) {
                    queryClient.setQueryData(["user"], data.user);
                } else {
                    queryClient.invalidateQueries({ queryKey: ["user"] });
                }
            }
        });
        return { error, isRegisterPending: isPending, registerMutation: mutateAsync };
    },

    useLogout: () => {
        const queryClient = useQueryClient();
        const { mutateAsync, isPending, error } = useMutation({
            mutationFn: authApis.logout,
            onSuccess: () => {
                disconnectSocket();
                queryClient.removeQueries({ queryKey: ["user"] }); // Clear user data on logout
            },
        });
        return { error, isLogoutPending: isPending, logoutMutation: mutateAsync };
    },

    useGetUser: () => {
        const { data, isLoading, error, isError } = useQuery({
            queryKey: ["user"],
            queryFn: authApis.getUser,
            retry: false,
            staleTime: 5 * 60 * 1000,
        });
        return {
            isLoading,
            user: data,
            error,
            isAuthenticated: !isError && !!data
        };
    },

    useGetUserById: (id) => {
    const { data, isLoading, error, isError } = useQuery({
        queryKey: ["userById", id],
        queryFn: () => authApis.getUserById(id),
        enabled: !!id,
        retry: false,
        staleTime: 5 * 60 * 1000,
    });

    return {
        isLoading,
        user: data,
        error,
        isAuthenticated: !isError && !!data
    };
},

    useCompleteOnboarding: () => {
        const queryClient = useQueryClient();
        const { mutateAsync, isPending, error } = useMutation({
            mutationFn: authApis.completeOnboarding,
            onSuccess: (data) => {
                queryClient.setQueryData(["user"], data.user); // Update user cache directly
            }
        });
        return { error, isPending, onboardingMutation: mutateAsync };
    },

    useGetOnboardStatus: () => {
        // Share the same ["user"] cache as useGetUser to avoid a duplicate fetch
        // and the race condition it causes in PrivateRoute
        const { data, isLoading, refetch } = useQuery({
            queryKey: ["user"],
            queryFn: authApis.getUser,
            retry: false,
            staleTime: 5 * 60 * 1000,
            select: (userData) => userData?.isBoarded // Transform data
        });
        return { isLoading, isBoarded: data, refetch };
    },

    useResetPassword: () => {
        const { mutateAsync, isPending, error } = useMutation({
            mutationFn: authApis.resetPassword,
        });
        return { error, isPending, resetPasswordMutation: mutateAsync };
    },

    useVerifyResetOtp: () => {
        const { mutateAsync, isPending, error } = useMutation({
            mutationFn: authApis.verifyResetOtp,
        });
        return { error, isPending, verifyOtpMutation: mutateAsync };
    },

    useSendResetOtp: () => {
        const { mutateAsync, isPending, error } = useMutation({
            mutationFn: authApis.sendResetOtp,
        });
        return { error, isPending, sendMutation: mutateAsync };
    }
};
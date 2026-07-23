import axiosInstance from "../lib/axios";

export const connectionApis = {
    getOutgoingFR: async () => {
        try {
            const response = await axiosInstance.get('/connections/outgoing-friend-requests');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getIncomingFR: async () => {
        try {
            const response = await axiosInstance.get('/connections/incoming-friend-requests');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get recommended users
    getRecommendation: async () => {
        try {
            const response = await axiosInstance.get('/connections/recommendations');
            return response.data?.recommendedUsers;
        } catch (error) {
            throw error;
        }
    },

    // Get friends list
    getFriends: async () => {
        try {
            const response = await axiosInstance.get('/connections/friends');
            return response.data || [];
        } catch (error) {
            return [];
        }
    },

    // Send friend request
    sendFriendRequest: async (userId) => {  // Fixed typo
        try {
            const response = await axiosInstance.post(`/connections/send-request/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Accept friend request
    acceptFriendRequest: async (requestId) => {
        try {
            const response = await axiosInstance.put(`/connections/accept-request/${requestId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Reject friend request
    rejectFriendRequest: async (requestId) => {
        try {
            const response = await axiosInstance.delete(`/connections/reject-request/${requestId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Remove friend    
    removeFriend: async (friendId) => {
        try {
            const response = await axiosInstance.delete(`/connections/remove-friend/${friendId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
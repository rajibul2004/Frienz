import axiosInstance from "../lib/axios";

export const connectionApis = {
    getOutgoingFR: async () => {
        try {
            const response = await axiosInstance.get('/connections/outgoing-friend-requests');
            return response.data;
        } catch (error) {
            console.error("Failed to get outgoing requests:", error);
            throw error;
        }
    },
    getIncomingFR: async () => {
        try {
            const response = await axiosInstance.get('/connections/incoming-friend-requests');
            return response.data;
        } catch (error) {
            console.error("Failed to get friend requests:", error);
            throw error;
        }
    },

    // Get recommended users
    getRecommendation: async () => {
        try {
            const response = await axiosInstance.get('/connections/recommendations');
            return response.data?.recommendedUsers;
        } catch (error) {
            console.error("Failed to get recommendations:", error);
            throw error;
        }
    },

    // Get friends list
    getFriends: async () => {
        try {
            const response = await axiosInstance.get('/connections/friends');
            console.log("Friends", response.data)
            return response.data || [];
        } catch (error) {
            console.error("Failed to get friends:", error);
            return [];
        }
    },

    // Send friend request
    sendFriendRequest: async (userId) => {  // Fixed typo
        try {
            const response = await axiosInstance.post(`/connections/send-request/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to send friend request:", error);
            throw error;
        }
    },

    // Accept friend request
    acceptFriendRequest: async (requestId) => {
        try {
            const response = await axiosInstance.put(`/connections/accept-request/${requestId}`); // Added missing /
            return response.data;
        } catch (error) {
            console.error("Failed to accept friend request:", error);
            throw error;
        }
    }
    ,
    // Remove friend    
    removeFriend: async (friendId) => {
        try {
            const response = await axiosInstance.delete(`/connections/remove-friend/${friendId}`);
            return response.data;
        } catch (error) {
            console.error("Failed to remove friend:", error);
            throw error;
        }
    }
};
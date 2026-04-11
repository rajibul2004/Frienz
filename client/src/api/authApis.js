import axiosInstance from "../lib/axios"

export const authApis = {
    login: async ({ formData }) => {
        const response = await axiosInstance.post('/auth/login', {
            email: formData.email?.toLowerCase().trim(),
            password: formData.password
        })
        return response.data
    },
    register: async ({ formData }) => {
        const response = await axiosInstance.post('/auth/register', {
            name: formData.name?.trim(),
            email: formData.email?.toLowerCase().trim(),
            password: formData.password
        })
        return response.data
    },
    logout: async () => {
        const response = await axiosInstance.post('/auth/logout')
        return response.data
    },
    getUser: async () => {
        try {
            const response = await axiosInstance.get('/auth/me');
            return response.data?.user || null;
        } catch {
            return null;
        }
    },
    sendResetOtp: async ({ email }) => {
        const response = await axiosInstance.post('/auth/send-reset-otp', {
            email: email?.toLowerCase().trim()
        });
        return response.data;
    },
    verifyResetOtp: async ({ email, otp }) => {
        const response = await axiosInstance.post('/auth/verify-reset-otp', {
            email: email?.toLowerCase().trim(),
            otp
        });
        return response.data;
    },
    resetPassword: async ({ email, newPassword }) => {
        const response = await axiosInstance.post('/auth/reset-password', {
            email: email?.toLowerCase().trim(),
            newPassword,
        });
        return response.data;
    },
    completeOnboarding: async ({ formData }) => {
        const response = await axiosInstance.post('/auth/update', {
            name: formData.name?.trim(),
            bio: formData.bio?.trim(),
            nativeLang: formData.nativeLang?.trim(),
            location: formData.location?.trim(),
            profilePic: formData.profilePic
        });
        return response.data;
    },
    getUserById: async (id) => {
        try {
            const response = await axiosInstance.get(`/auth/user/${id}`)
            return response.data.user
        }
        catch (err) {
            console.log("Error",err.message)
        }
    }
}
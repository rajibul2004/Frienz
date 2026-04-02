import axiosInstance from "../lib/axios"

export const authApis = {
    login: async ({ formData }) => {
        const response = await axiosInstance.post('/auth/login', {
            email: formData.email?.toLowerCase().trim(),
            password: formData.password
        })
        return response.data
    },
    register: async ({ formData}) => {
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
    resetPassword: async ({ email, newPassword, resetToken }) => {
        const response = await axiosInstance.post('/auth/reset-password', {
            email: email?.toLowerCase().trim(),
            newPassword,
            resetToken
        });
        return response.data;
    },
    completeOnboarding: async ({ name, bio, nativeLang, location, profilePic }) => {
        const response = await axiosInstance.post('/auth/update', {
            name: name?.trim(),
            bio: bio?.trim(),
            nativeLang: nativeLang?.trim(),
            location: location?.trim(),
            profilePic
        });
        console.log(response.data)
        return response.data;
    }
}
import axios from "axios";

const DEV_BASE_URL=import.meta.env.VITE_SERVER_URL
console.log("Development Base URL:", DEV_BASE_URL);
const BASE_URL=import.meta.env.MODE=== "development"? DEV_BASE_URL : "/api"


const axiosInstance=axios.create({
    baseURL:BASE_URL,
    withCredentials:true
})
export default axiosInstance
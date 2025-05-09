import { notification } from 'antd';
import axios from "axios";
import { TOKEN_KEY, USER_REF } from '../constant/constant';


export const api = axios.create({
    baseURL: import.meta.env.VITE_API_END_POINT
});


api.interceptors.response.use(
    (response)=>{
        return response;
    },
    async (err)=>{
        const response = err?.response;
        const status = response ? response.status : null;

        if (!response) {
            notification.warning({
                message: 'Network Error',
                description: 'There was an issue with your network connection. Please try again later.'
            });
            return Promise.reject(err);
        }

        if(status && status === 401)
        {
            const errorMessage = err?.response?.data?.message || "401 Unauthorized";

            notification.warning({
                message: '401 Unauthorized',
                description: errorMessage
            });

            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_REF);

            ///
            window.location.href = '/login';

        }

        return Promise.reject(err);
    }
);

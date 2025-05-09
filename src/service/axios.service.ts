import { Method } from 'axios';
import {api} from '../config/axios.conf';
import { TOKEN_KEY } from '../constant/constant';

export const dbService = async(apiPath: string, method: Method, body: any = {}) => {
    try 
    {
        const token = localStorage.getItem(TOKEN_KEY);

        const response = await api({
            url: apiPath,
            method: method,
            data: body,
            headers: {
                Authorization: "Bearer "+ token
            }
        });


        return response;
    } 
    catch (error:any) {
        throw Error(error);
    }
}
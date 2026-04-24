import { axiosAuth } from "./api.js";  

export const login = async (data) => {
    return await axiosAuth.post('login', data)
}

export const getAllUsers = async () => {
    const { data } = await axiosAuth.get('/users');
    return { users: data };
}


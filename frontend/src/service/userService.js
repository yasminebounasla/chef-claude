import { authFetch, BASE_URL } from "../utils/api.js";

const getToken = () => {
    return localStorage.getItem('token');
};

export const getProfile = async () => {
    const token = getToken();
    return authFetch(`${BASE_URL}/auth/profile`, {method : 'GET'}, token)
}

export const editprofile = async (name, email) => {
    const token = getToken();
    return authFetch(`${BASE_URL}/auth/profile`, {
        method : "PUT", 
        body : JSON.stringify({name, email})
    }, token)
}

export const deleteProfile = async (password) => {
    const token = getToken();
    return authFetch(`${BASE_URL}/auth/profile`, {
        method : "DELETE",
        body : JSON.stringify({password})
    }, token)
}

export const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    const token = getToken();
    return authFetch(`${BASE_URL}/auth/profile/password`, {
        method : "PUT",
        body : JSON.stringify({currentPassword, newPassword, confirmNewPassword})
    }, token)
}
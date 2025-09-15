import { authFetch, BASE_URL } from "../utils/api";

export const getProfile = async () => {
    return authFetch(`${BASE_URL}/auth/profile`, {method : 'GET'}, token)
}

export const editprofile = async (name, email) => {
    return authFetch(`${BASE_URL}/auth/profile`, {
        method : "PUT", 
        body : JSON.stringify({name, email})
    }, token)
}

export const deleteProfile = async (password) => {
    return authFetch(`${BASE_URL}/auth/profile`, {
        method : "DELETE",
        body : JSON.stringify({password})
    }, token)
}

export const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
    return authFetch(`${BASE_URL}/auth/profile/password`, {
        method : "PUT",
        body : JSON.stringify({currentPassword, newPassword, confirmNewPassword})
    }, token)
}
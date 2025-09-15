import { authFetch, BASE_URL } from "../utils/api.js";

export const loginUser = async (email, password) => {
    return authFetch(`${BASE_URL}/auth/login`, {
        method : "POST",
        body: JSON.stringify({ email, password })
    });
}

export const registerUser = async (email, password, confirmPassword, name) => {
    return authFetch(`${BASE_URL}/auth/register`, {
        method: "POST",
        body : JSON.stringify({email, password, confirmPassword, name})
    })
}
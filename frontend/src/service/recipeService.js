import { authFetch, BASE_URL } from "../utils/api.js";

const getToken = () => {
    return localStorage.getItem('token');
};

export const getHistory = async () => {
    const token = getToken();
    return authFetch(`${BASE_URL}/recipe/history`, { method: "GET" }, token);
}

export const addToHistory = async (recipe, isFavorite = false) => {
    const token = getToken();
    return authFetch(`${BASE_URL}/recipe/history`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipe,
            isFavorite
        })
    }, token);
}

export const deleteHistory = async (recipeId) => {
    const token = getToken();
    return authFetch(`${BASE_URL}/recipe/history/${recipeId}`, {
        method: "DELETE"
    }, token);
}

export const clearHistory = async () => {
    const token = getToken();
    return authFetch(`${BASE_URL}/recipe/history`, {
        method: "DELETE"
    }, token);
}

export const getFavorite = async () => {
    const token = getToken();
    return authFetch(`${BASE_URL}/recipe/favorites`, {
        method: "GET"
    }, token);
}

export const addToFavorite = async (recipe, isFavorite = true) => {
    const token = getToken();
    return authFetch(`${BASE_URL}/recipe/favorites`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            recipe,
            isFavorite
        })
    }, token);
}

export const toggleFavorite = async (recipeId) => {
    const token = getToken();
    return authFetch(`${BASE_URL}/recipe/favorites/${recipeId}/toggle`, {
        method: "PUT"
    }, token);
}

export const removeFavorite = async (recipeId) => {
    const token = getToken();
    return authFetch(`${BASE_URL}/recipe/favorites/${recipeId}`, {
        method: "DELETE"
    }, token);
}
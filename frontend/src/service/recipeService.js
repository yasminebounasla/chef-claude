import { authFetch, BASE_URL } from "../utils/api.js";

export const getHistory = async () => {
    return authFetch(`${BASE_URL}/recipe/history`, { method : "GET"}, token)
}

export const addToHistory = async (recipe, isFavorite = false) => {
    return authFetch(`${BASE_URL}/recipe/history`, {
        method: "POST",
        body: JSON.stringify({
            recipe,
            isFavorite
        })
    }, token);
}

export const deleteHistory = async (recipeId) => {
    return authFetch(`${BASE_URL}/recipe/history/${recipeId}`, {
        method : "DELETE"
    }, token)
}

export const clearHistory = async () => {
    return authFetch(`${BASE_URL}/recipe/history`, {
        method : "DELETE"
    }, token)
}

export const getFavorite = async () => {
    return authFetch(`${BASE_URL}/recipe/favorites`, {
        method : "GET"
    }, token)
}

export const addToFavorite = async (recipe, isFavorite = true) => {
    return authFetch(`${BASE_URL}/recipe/favorites`, {
        method: "POST",
        body : JSON.stringify({
            recipe,
            isFavorite
        })
    }, token)
}

export const toggleFavorite = async (recipeId) => {
    return authFetch(`${BASE_URL}/recipe/favorites/${recipeId}/toggle`, {
        method : "PUT"
    }, token)
}

export const removeFavorite = async (recipeId) => {
    return authFetch(`${BASE_URL}/recipe/favorites/${recipeId}`, {
        method : "DELETE"
    }, token)
}
export const BASE_URL = "http://localhost:5000/api" ;

export const authFetch = async (url, options = {}, token) => {
    try {
        const res = await fetch(url , {
            ...options,
            headers : {
                "content-Type":"application/json",
                ...(token ? {"Authorization": `Bearer ${token}`} : {}),
                ...options.headers
            }
        });

        if(res.status === 401) {
            localStorage.removeItem('token');
            window.location.href='/login';
            throw new Error("Unauthorized - please login again");
        }

        const text = await res.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch {
            data = text;
        }

        if (!res.ok) throw new Error(data?.message || data || "Request failed");
        return data;

    } catch (error) {
        throw new Error(error.message || "Network error occurred");
    }
}
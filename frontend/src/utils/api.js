export const BASE_URL = "http://localhost:5000/api";

export const authFetch = async (url, options = {}, token) => {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    
    if (!res.ok) {
      // ✅ Handle 401 only for protected routes
      if (res.status === 401 && token) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
      
      // Create a custom error that preserves the response data
      const error = new Error(data?.message || data || "Request failed");
      error.response = {
        data: data,
        status: res.status,
        statusText: res.statusText
      };
      throw error;
    }
    
    return data;
  } catch (error) {
    // If it's already our custom error, re-throw it
    if (error.response) {
      throw error;
    }
    // For network errors, create a simple error
    throw new Error(error.message || "Network error occurred");
  }
};
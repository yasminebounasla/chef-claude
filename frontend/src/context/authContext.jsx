import { useState, useEffect, createContext } from "react";
import { loginUser, registerUser } from "../service/authService.js";
import { decodeJWT, isTokenExpired } from "../utils/auth.js";

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const checkAuth = () => {
            try {
                const token = localStorage.getItem('token');
                
                if (token && token.trim() !== "" && token !== "null" && token !== "undefined") {
                    if (isTokenExpired(token)) {
                        localStorage.removeItem("token");
                        setUser(null);
                        return;
                    }

                    const decoded = decodeJWT(token);
                    if(decoded) {
                        const userInfo = {
                            id: decoded.id || decoded.userId || decoded.sub,
                            name: decoded.name || decoded.username || `${decoded.firstName || ''} ${decoded.lastName || ''}`.trim() || "User",
                            email: decoded.email,
                            initials: (decoded.name || decoded.username || "UN")
                                .split(" ")
                                .map(n => n[0])
                                .join("")
                                .toUpperCase()
                        };
                        setUser(userInfo);
                    } else {
                        localStorage.removeItem('token');
                        setUser(null);
                    }
                } else {
                    setUser(null);
                } 
            } catch (error) {
                console.error("Error checking authentication:", error);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        } 
        checkAuth();
    }, []);

    const getErrorMessage = (error) => {
        console.log("Full error object:", error);
        console.log("Error response:", error.response);
        console.log("Error response data:", error.response?.data);
        
        if (error.response?.data) {
            const errorData = error.response.data;
            
            if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
                return errorData.errors[0].message;
            }
            
            if (errorData.message) {
                return errorData.message;
            }
        }
        
        if (error.data?.errors && Array.isArray(error.data.errors) && error.data.errors.length > 0) {
            return error.data.errors[0].message;
        }
        
        if (error.data?.message) {
            return error.data.message;
        }
        
        return error.message || "An unexpected error occurred";
    };

    // Login function
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await loginUser(email, password);
            
            const data = response.data || response;
            const {token, user: userData} = data;

            if (!token) {
                throw new Error("No token received from server");
            }

            localStorage.setItem("token", token);

            const userInfo = {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                initials: (userData.name || "UN")
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .toUpperCase()
            };

            setUser(userInfo);
            return { success: true };

        } catch (err) {
            console.error("Login error:", err);
            const errorMessage = getErrorMessage(err);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }

    // Register function 
    const register = async (email, password, confirmPassword, name) => {
        setLoading(true);

        try {
            const response = await registerUser(email, password, confirmPassword, name);
            const data = response.data || response;
            const {token, user: registeredUser} = data;

            if (!token) {
                throw new Error("No token received from server");
            }

            localStorage.setItem('token', token);

            const userInfo = {
                id: registeredUser.id,
                name: registeredUser.name,
                email: registeredUser.email,
                role: registeredUser.role,
                initials: (registeredUser.name || "UN")
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .toUpperCase()
            };

            setUser(userInfo);
            return { success: true };

        } catch(err) {
            console.error("Registration error:", err);
            const errorMessage = getErrorMessage(err);
            return { success: false, message: errorMessage };
        } finally {
            setLoading(false);
        }
    }

    // Logout function
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ 
                user, 
                login, 
                register, 
                logout, 
                loading, 
                setLoading,
                isAuthenticated: !!user
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}
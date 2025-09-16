import { useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import { Link } from "react-router-dom";
import '../style/Form.css'

export const LoginForm = ({ onClose , handleRegister}) => {
    const { login, loading } = useContext(AuthContext);
    const [error, setError] = useState("");

    const handleLogin = async (formData) => {
        setError("");
        
        const email = formData.get("email");
        const password = formData.get("password");

        // Basic validation
        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        try {
            const result = await login(email, password);
            
            if (result.success) {
                onClose(); 
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError("An unexpected error occurred");
            console.error("Login form error:", err);
        }
    };
    

    return (
        <div className="list-overlay" onClick={onClose}>
            <div className="list-container login-form-container" onClick={(e) => e.stopPropagation()}>
                <div className="list-header">
                    <h1 className="list-title">Sign In</h1>
                    <button className="close-btn" onClick={onClose} disabled={loading}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                
                <div className="list-content">
                    <form className="login-form" action={handleLogin}>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Enter your email..."
                                disabled={loading}
                                required
                                onChange={() => error && setError("")} 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="Enter your password..."
                                disabled={loading}
                                required
                                onChange={() => error && setError("")} 
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        
                        <button 
                            type="submit" 
                            className="login-submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                        
                        <p className="signup-link">
                            Don't have an account?
                            <span className="link-text" onClick={handleRegister}>
                                Sign up
                            </span>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
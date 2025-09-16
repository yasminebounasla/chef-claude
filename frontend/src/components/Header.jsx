import { useState, useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import "../style/Header.css";

export const Header = ({ handleFavorites, handleHistory, handleLogin, handleRegister }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useContext(AuthContext);
   
    const handleSignOut = () => {
        logout();
        setMenuOpen(false);
    };

    const userInitial = user?.name ? user.name[0].toUpperCase() : "?";

    return (
        <header className="header">
            <div
                className="menu-container"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
            >
                <div className="hamburger-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </div>
               
                {menuOpen && (
                    <div className="dropdown-menu">
                        {isAuthenticated && (
                            <>
                                <button className="dropdown-item" onClick={handleHistory}>
                                    <svg className="item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12,6 12,12 16,14"/>
                                    </svg>
                                    History
                                </button>
                                <button className="dropdown-item" onClick={handleFavorites}>
                                    <svg className="item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                    Favorites
                                </button>
                            </>
                        )}
                    </div>
                )}
            </div>
            
            <div className="logo">
                <img src="/chef-claude-icon.png" alt="chef-claude-icon" className="header-icon"/>
                <h1 className="header-title">Chef Claude</h1>
            </div>
            
            {/* Right Section */}
            <div className="right-section" 
                onMouseEnter={() => setUserMenuOpen(true)}
                onMouseLeave={() => setUserMenuOpen(false)}
            >
                {isAuthenticated ? (
                    <div className="relative user-menu-container">
                        {/* Avatar */}
                        <div
                            className="avatar-circle"
                        >
                            {userInitial}
                        </div>

                        {/* Dropdown */}
                        {userMenuOpen && (
                            <div className="user-dropdown">
                                <button className="dropdown-item">
                                    <svg className="item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                        <circle cx="12" cy="7" r="4"/>
                                    </svg>
                                    Profile
                                </button>
                                <button className="dropdown-item logout" onClick={handleSignOut}>
                                    <svg className="item-icon" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16 17 21 12 16 7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                    </svg>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <button className="signIn-btn" onClick={handleLogin}>Sign In</button>
                        <button className="signUp-btn" onClick={handleRegister}>Sign Up</button>
                    </>
                )}
            </div>
        </header>
    );
};
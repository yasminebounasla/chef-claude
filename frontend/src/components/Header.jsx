import { useState } from "react";
import "../style/Header.css";

export const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="header">
            {/* Left: Menu with hamburger icon */}
            <div
                className="menu-container"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
            >
                {/* Hamburger Icon */}
                <div className="hamburger-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </div>
                
                {/* Dropdown menu */}
                {menuOpen && (
                    <div className="dropdown-menu">
                        <button className="dropdown-item">
                            <svg className="item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"/>
                                <polyline points="12,6 12,12 16,14"/>
                            </svg>
                            History
                        </button>
                        <button className="dropdown-item">
                            <svg className="item-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                            Favorites
                        </button>
                    </div>
                )}
            </div>

            {/* Center: Logo */}
            <div className="logo">
                <img src="/chef-claude-icon.png" alt="chef-claude-icon"  className="header-icon"/>
                <h1 className="header-title">Chef Claude</h1>
            </div>

            {/* Right: Auth buttons */}
            <div className="btns">
                <button className="signIn-btn">Sign In</button>
                <button className="signUp-btn">Sign Up</button>
            </div>
        </header>
    );
};
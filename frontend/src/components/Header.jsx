import "../style/Header.css"

export const Header = () => {
    return (
        <header className="header">
            <img src="/chef-claude-icon.png" alt="chef-claude-icon"  className="header-icon"/>
            <h1 className="header-title">Chef Claude</h1>
        </header>
    )
}
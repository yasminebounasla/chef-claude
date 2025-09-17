import { useState, useEffect, useContext } from "react";
import { getHistory, getFavorite, deleteHistory, removeFavorite, clearHistory } from "../service/recipeService.js"; 
import "../style/List.css";
import { AuthContext } from "../context/authContext.jsx";

export const List = ({ type, onClose, onRecipeClick }) => { 
    const [items, setItems] = useState([]);
    const { loading, setLoading } = useContext(AuthContext);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let response;
                if (type === "history") {
                    response = await getHistory();
                } else if (type === "favorite") {
                    response = await getFavorite(); 
                }

                const itemsData = response.data;  
                setItems(Array.isArray(itemsData) ? itemsData : []);

            } catch (error) {
                console.error('Failed to fetch data:', error);
                setItems([]);
            }
            setLoading(false);
        };

        fetchData();
    }, [type]);

    const handleDelete = async (id) => {
        try {
            if (type === "history") {
                await deleteHistory(id);
                setItems((prev) => prev.filter((item) => item._id !== id));
            } else {
                await removeFavorite(id);
                setItems((prev) => prev.filter((item) => item._id !== id));
            }
        } catch (err) {
            console.error("Delete failed:", err);
        }
    };

    const handleClear = async () => {
        try {
            await clearHistory();
            setItems([]); 
        } catch (err) {
            console.error("Failed to clear history:", err);
        }
    };

    const handleRecipeClick = (recipe) => {
        if (onRecipeClick) { 
            onRecipeClick(recipe);
            onClose(); 
        }
    };
    
    const extractTitle = (text = "") => {
        if (!text) return "Untitled Recipe";

        const ingIndex = text.indexOf("Ingredients");
        let title = ingIndex > 0 
            ? text.slice(0, ingIndex).trim().split("\n").pop()
            : text.split("\n").find(line => line.trim() !== "") || "";

        title = title.replace(/[*#_`>~]/g, "").trim();

        if (title.length > 0) {
            title = title.charAt(0).toUpperCase() + title.slice(1);
        }

        return title || "Untitled Recipe";
    };

    return (
        <div className="list-overlay" onClick={onClose}>
            <div className="list-container" onClick={(e) => e.stopPropagation()}>
                <div className="list-header">
                    <h2 className="list-title">
                        {type === "history" ? "Recipe History" : "Favorite Recipes"}
                    </h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="18" y1="6" x2="6" y2="18"/>
                            <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                    </button>
                </div>
                
                <div className="list-content">
                    {loading ? (
                        <div className="loading">Loading...</div>
                    ) : items.length === 0 ? (
                        <div className="empty-state">
                            <p>No {type === 'history' ? 'history' : 'favorites'} found</p>
                        </div>
                    ) : (
                        <div className="items-list">
                        {items.map((item) => (
                            <div 
                                key={item._id} 
                                className="item-card"
                                onClick={() => handleRecipeClick(item.recipe || item.text || "")} 
                            > 
                                <div className="item-info">
                                    <h3 className="item-name">
                                        {extractTitle(item.recipe || item.text || "")}
                                    </h3>
                                    <p className="item-date">
                                        {new Date(item.createdAt || item.date).toLocaleDateString()}
                                    </p>
                                </div>
                                
                                <div className="item-actions">
                                    <button 
                                        className="delete-btn" 
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            handleDelete(item._id);
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div> 
                                
                            </div>
                        ))}
                    </div>
                    )}
                </div>

                {type === "history" && items.length > 0 && (
                    <button className="clear-btn" onClick={handleClear}>
                        Clear History
                    </button>
                )}
            </div>
        </div>
    );
};
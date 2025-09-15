import { useState, useEffect } from "react";
import { getHistory, getFavorite } from "../service/recipeService.js"; 
import "../style/List.css"

export const List = ({ type, onClose }) => { 
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let data;
                if (type === "history") {
                    data = await getHistory();
                } else {
                    data = await getFavorite(); 
                }
                setItems(data);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setItems([]);
            }
            setLoading(false);
        };

        fetchData();
    }, [type]);

    return (
        <div className="list-overlay">
            <div className="list-container">
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
                                <div key={item.id} className="item-card">
                                    <div className="item-info">
                                        <h3 className="item-name">{item.recipe?.name || item.name}</h3>
                                        <p className="item-date">{new Date(item.createdAt || item.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="item-actions">
                                        <button className="delete-btn">
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
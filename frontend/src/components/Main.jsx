import "../style/Main.css";
import { useState, useContext } from "react";
import { ClaudeRecipe } from "./ClaudeRecipe.jsx";
import { IngredientsLists } from "./IngredientsList.jsx";
import { getRecipeFromMistral } from "../utils/ai.js";
import { addToFavorite, addToHistory } from "../service/recipeService.js";
import { AuthContext } from "../context/authContext.jsx";

export const Main = ({handleLogin}) => {
    const [ingredients, setIngredient] = useState([]);
    const [recipe, setRecipe] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [showFavorites, setShowfavorites] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
    const [error, setError] = useState("");
    
    const { isAuthenticated, loading, setLoading } = useContext(AuthContext);
   
    const handleFavoriteClick = () => {
        setShowfavorites(true);
    }
   
    const handleHistoryClick = () => {
        setShowHistory(true);
    }
   
    const addIngredient = (e) => {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const newIngredient = formData.get("ingredient");
        
        // Validate ingredient is not empty or just whitespace
        if (!newIngredient || newIngredient.trim() === "") {
            setError("Please enter a valid ingredient");
            return;
        }
        
        // Check if ingredient already exists (case-insensitive)
        if (ingredients.some(ingredient => 
            ingredient.toLowerCase().trim() === newIngredient.toLowerCase().trim()
        )) {
            setError("This ingredient is already added");
            return;
        }
        
        // Clear any existing error
        setError("");
       
        setIngredient((prevIngr) => [
            ...prevIngr,
            newIngredient.trim()
        ]);
        
        // Clear the input field
        e.target.reset();
    };
    
    // Function to delete a specific ingredient
    const deleteIngredient = (indexToDelete) => {
        setIngredient((prevIngr) => 
            prevIngr.filter((_, index) => index !== indexToDelete)
        );
    };
    
    // Function to clear recipe and start fresh
    const clearRecipe = () => {
        setRecipe("");
        setIngredient([]); // Clear all ingredients too
        setIsFavorited(false);
        setError("");
    };
   
    const getRecipe = async() => {
        setError(""); 
        try {
            const generatedRecipe = await getRecipeFromMistral(ingredients);
            setRecipe(generatedRecipe);
            setIsFavorited(false);
            await addToHistory(generatedRecipe, false);

        } catch (error) {
            console.error('Error generating recipe:', error);
            setError('Failed to generate recipe. Please try again.');
        }
    }
    
    const handleAddToFavorites = async () => {
        setError(""); 
        
        if (!recipe || !isAuthenticated) {
            setError('Please login and generate a recipe first.');
            return;
        }
        
        setLoading(true);
        try {
            if (!isFavorited) {
                const response = await addToFavorite(recipe, true);
                console.log('Added to favorites:', response);
                setIsFavorited(true);
            } else {
                setIsFavorited(false);
            }
        } catch (error) {
            console.error('Error updating favorites:', error);
            setError('Failed to update favorites. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const handleCloseError = () => {
        setError("");
    }

    // Landing Page Component
    const LandingPage = () => (
        <div className="landing-page">
            <div className="landing-hero">
                <div className="hero-icon">
                    <img src="/chef-claude-icon.png" alt="chef-claude-icon" className="landing-icon"/>
                </div>
                <h1>Welcome to Chef Claude</h1>
                <p className="hero-subtitle">Transform your ingredients into delicious recipes with AI-powered cooking assistance</p>
                
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                            </svg>
                        </div>
                        <h3>Smart Recipe Generation</h3>
                        <p>Add your available ingredients and get personalized recipes instantly</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                            </svg>
                        </div>
                        <h3>Save Favorites</h3>
                        <p>Keep track of your favorite recipes and access them anytime</p>
                    </div>
                    
                    <div className="feature-card">
                        <div className="feature-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 1v6m0 0l4-4m-4 4L8 3m8 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z"/>
                                <path d="M12 23a7.5 7.5 0 0 0 5.4-2.4c.3-.3.6-.6.9-1a6.5 6.5 0 0 0-.9-9.1 5 5 0 0 0-7 0 6.5 6.5 0 0 0-.9 9.1c.3.4.6.7.9 1A7.5 7.5 0 0 0 12 23"/>
                            </svg>
                        </div>
                        <h3>Recipe History</h3>
                        <p>Browse through all your previously generated recipes</p>
                    </div>
                </div>

                <div className="cta-section">
                    <h2>Ready to start cooking?</h2>
                    <p>Sign up now to unlock the full potential of Chef Claude</p>
                    <button className="cta-button" style={{ "backgroundColor" :"#D17557"}} onClick={handleLogin}>Get Started</button>
                </div>
            </div>
        </div>
    );
   
    return (
        <main>
            <div className="main">
                {!isAuthenticated ? (
                    <LandingPage />
                ) : (
                    <>
                        {/* Error Display */}
                        {error && (
                            <div className="error-container">
                                <div className="error-message">
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="error-icon"
                                    >
                                        <circle cx="12" cy="12" r="10"/>
                                        <line x1="15" y1="9" x2="9" y2="15"/>
                                        <line x1="9" y1="9" x2="15" y2="15"/>
                                    </svg>
                                    <span>{error}</span>
                                    <button
                                        className="error-close-btn"
                                        onClick={handleCloseError}
                                        aria-label="Close error message"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                        )}

                        <form
                            className="add-ingredient-form"
                            onSubmit={addIngredient}
                        >
                            <input
                                aria-label="Add ingredient"
                                type="text"
                                placeholder="e.g egg"
                                name="ingredient"
                                required
                            />
                            <button type="submit">Add ingredient</button>
                        </form>
                        
                        {ingredients.length > 0 && (
                            <IngredientsLists 
                                ingredients={ingredients} 
                                handleClick={getRecipe}
                                onDeleteIngredient={deleteIngredient}
                            />
                        )}
                        
                        {recipe && (
                            <>
                                <ClaudeRecipe recipe={recipe}/>
                                <div className="recipe-actions">
                                    <div className="add-to-favorites">
                                        <button
                                            className={`add-favorites-btn ${isFavorited ? 'favorited' : ''}`}
                                            onClick={handleAddToFavorites}
                                            disabled={loading || !isAuthenticated}
                                        >
                                            <svg
                                                width="18"
                                                height="18"
                                                viewBox="0 0 24 24"
                                                fill={isFavorited ? "currentColor" : "none"}
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                                            </svg>
                                            {loading ? 'Saving...' : 
                                             !isAuthenticated ? 'Login to Save' :
                                             (isFavorited ? 'Added to Favorites' : 'Add to Favorites')}
                                        </button>
                                    </div>
                                    
                                    <button
                                        className="clear-recipe-btn"
                                        onClick={clearRecipe}
                                        disabled={loading}
                                    >
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                        >
                                            <path d="M3 6h18"/>
                                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                                            <path d="M8 6V4c0-1 1-2 2-2h4c-1 0 2 1 2 2v2"/>
                                        </svg>
                                        Clear All & Get New Recipe
                                    </button>
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </main>
    );
};
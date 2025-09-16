import "../style/Main.css";
import { useState, useContext } from "react";
import { ClaudeRecipe } from "./ClaudeRecipe.jsx";
import { IngredientsLists } from "./IngredientsList.jsx";
import { getRecipeFromMistral } from "../utils/ai.js";
import { addToFavorite, addToHistory } from "../service/recipeService.js";
import { AuthContext } from "../contexts/authContext.jsx";

export const Main = () => {
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
   
    const addIngredient = (formData) => {
        const newIngredient = formData.get("ingredient");
       
        setIngredient((prevIngr) => [
            ...prevIngr,
            newIngredient
        ]);
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
   
    return (
        <main>
            <div className="main">
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
                    action={addIngredient}
                >
                    <input
                        aria-label="Add ingredient"
                        type="text"
                        placeholder="e.g egg"
                        name="ingredient"
                    />
                    <button>Add ingredient</button>
                </form>
                {ingredients.length > 0 && <IngredientsLists ingredients={ingredients} handleClick={getRecipe}/>}
                {recipe && (
                    <div className="recipe-container">
                        <ClaudeRecipe recipe={recipe}/>
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
                    </div>
                )}
            </div>
        </main>
    );
};
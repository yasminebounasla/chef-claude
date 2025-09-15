import "../style/Main.css";
import { useState } from "react";
import { ClaudeRecipe } from "./ClaudeRecipe.jsx";
import { IngredientsLists } from "./IngredientsList.jsx";
import { getRecipeFromMistral } from "../utils/ai.js";

export const Main = () => {
    const [ingredients, setIngredient] = useState([]);
    const [recipe, setRecipe] = useState("");
    const [showHistory, setShowHistory] = useState(false);
    const [showFavorites, setShowfavorites] = useState(false);
    const [isFavorited, setIsFavorited] = useState(false);
   
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
       const generatedRecipe = await getRecipeFromMistral(ingredients);
       setRecipe(generatedRecipe);
       setIsFavorited(false); 
    }

    const handleAddToFavorites = () => {
        setIsFavorited(!isFavorited);
    }
   
    return (
        <main>
            <div className="main">
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
                                {isFavorited ? 'Added to Favorites' : 'Add to Favorites'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};
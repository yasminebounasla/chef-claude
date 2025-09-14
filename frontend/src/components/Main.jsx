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
                        <div className="recipe-header">
                            <button 
                                className={`favorite-btn`}
                
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26 12,2"/>
                                </svg>
                            </button>
                        </div>
                        <ClaudeRecipe recipe={recipe}/> 
                    </div>
                )}
            </div>
        </main>
    );
};
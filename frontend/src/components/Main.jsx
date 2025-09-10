import "../style/Main.css";
import { useState } from "react";
import { ClaudeRecipe } from "./ClaudeRecipe.jsx";
import { IngredientsLists } from "./IngredientsList.jsx";
import { getRecipeFromMistral } from "../utils/ai.js";

export const Main = () => {
    const [ingredients, setIngredient] = useState([]);
    const [recipe, setRecipe] =useState("");
    
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

            { ingredients.length > 0 && <IngredientsLists  ingredients={ingredients} handleClick={getRecipe}/>}


            {recipe &&  <ClaudeRecipe recipe={recipe}/> }
            
        </main>
    );
};
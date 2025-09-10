import "../style/Main.css";
import { useState } from "react";
import { ClaudeRecipe } from "./claudeRecipe.jsx";
import { IngredientsLists } from "./ingredientsList.jsx";

export const Main = () => {
    const [ingredients, setIngredient] = useState([]);
    const [recipeShown, setRecipeShown] =useState(false);
    
    const addIngredient = (formData) => {
        const newIngredient = formData.get("ingredient");
        
        setIngredient((prevIngr) => [
            ...prevIngr,
            newIngredient
        ]);
        
    };

    const toggleRecipeShwon = ()=> {
        setRecipeShown( prev => !prev )
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

            { ingredients.length > 0 && <IngredientsLists  ingredients={ingredients} handleClick={toggleRecipeShwon}/>}


            {recipeShown &&  <ClaudeRecipe /> }
            
        </main>
    );
};
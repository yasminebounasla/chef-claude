import "../style/Main.css";
import { useState } from "react";

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

            { ingredients.length > 0 && (
                <section>
                <h1>Ingredients on hand :</h1>
                <ul>
                    {ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                    ))}
                </ul>

                {ingredients.length > 3 && (
                    <div className="get-recipe-container">
                        <div>
                            <h3>Ready for a recipe ?</h3>
                            <p>Generate a recipr from your list of ingredients</p>
                        </div>

                        <button onClick={toggleRecipeShwon}>Get a recipe</button>
                    </div> )}
            </section> )}


            {recipeShown && (
                <section>
                    <h2>Chef Claude Recommends:</h2>
                    <p>Based on the ingredients you have available, I would recommend {}. Here is the recipe:</p>

                    <h3>Beef Bolognese Pasta</h3>
                    <ul>
                        <li></li>
                    </ul>

                    <h3>Instructions:</h3>
                    <ol>
                        <li></li>
                    </ol>
                </section> )}
            
        </main>
    );
};
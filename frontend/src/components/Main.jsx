import "../style/Main.css";
import { useState } from "react";

export const Main = () => {
    const [ingredients, setIngredient] = useState([]);
    
    const addIngredient = (formData) => {
        const newIngredient = formData.get("ingredient");
        
        setIngredient((prevIngr) => [
            ...prevIngr,
            newIngredient
        ]);
        
    };
    
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
            <ul>
                {ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
        </main>
    );
};
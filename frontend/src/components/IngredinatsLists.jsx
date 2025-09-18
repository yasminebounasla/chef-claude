export const IngredientsLists = ({ ingredients, handleClick, onDeleteIngredient }) => {
    return (
        <section>
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">
                {ingredients.map((ingredient, index) => (
                    <li key={index} className="ingredient-item">
                        <span className="ingredient-text">{ingredient}</span>
                        <button
                            className="delete-ingredient-btn"
                            onClick={() => onDeleteIngredient(index)}
                            aria-label={`Remove ${ingredient}`}
                            title={`Remove ${ingredient}`}
                        >
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <line x1="18" y1="6" x2="6" y2="18"/>
                                <line x1="6" y1="6" x2="18" y2="18"/>
                            </svg>
                        </button>
                    </li>
                ))}
            </ul>

            {ingredients.length > 0 && (
                <div className="ready-for-recipe">
                    <p>Ready for a recipe?</p>
                    <button onClick={handleClick} className="get-recipe-btn">
                        Get a recipe
                    </button>
                </div>
            )}
        </section>
    );
};
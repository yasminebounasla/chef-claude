export const IngredientsLists = (props) => {
    return (
        <section>
            <h1>Ingredients on hand :</h1>
            <ul>
                {props.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>

            {props.ingredients.length > 3 && (
                <div className="get-recipe-container">
                    <div>
                        <h3>Ready for a recipe ?</h3>
                        <p>Generate a recipr from your list of ingredients</p>
                    </div>

                    <button onClick={props.handleClick}>Get a recipe</button>
                </div> )}
        </section>
    )
}
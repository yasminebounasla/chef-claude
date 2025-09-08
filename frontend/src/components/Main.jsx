import "../style/Main.css"

export const Main = () => {
    return(
        <main>
            <form className="add-ingredient-form">
                <input 
                    aria-label="Add ingredient" 
                    type="text" 
                    placeholder="e.g egg"
                />
                <button>Add ingredient</button>
            </form>
        </main>
    )
}
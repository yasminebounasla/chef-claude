import ReactMarkDown from "react-markdown"

export const ClaudeRecipe = (props) => {
    return(
        <section className="suggested-recipe-container" aria-live = "polite">
            <h2 style={{color: "black"}}>Chef Claude Recommends :</h2>
            <ReactMarkDown>
                {props.recipe}
            </ReactMarkDown>
        </section> 
    )
}

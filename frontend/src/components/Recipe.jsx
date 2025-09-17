import ReactMarkDown from "react-markdown";
import "../style/Recipe.css";

export const Recipe = ({ recipe, closeRecipe }) => {
  return (
    <div className="recipe-overlay" onClick={closeRecipe}>
      <div className="recipe-container" onClick={(e) => e.stopPropagation()}>
        <div className="recipe-header">
          <h2 className="recipe-title">Selected Recipe</h2>
          <button className="recipe-close-btn" onClick={closeRecipe}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <div className="recipe-content">
          <section className="Recipe-container" aria-live="polite">
            <h2 style={{ color: "black" }}>Chef Claude Recommends :</h2>
            <ReactMarkDown>{recipe}</ReactMarkDown>
          </section>
        </div>
      </div>
    </div>
  );
};

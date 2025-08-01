import "./RecipeCard.css"

export default function RecipeCard(props) {
    return (
        <div className="recipe-card">
            <div className="recipe-img">
                <img src={props.image}></img>

            </div>
            <div className="recipe-text">
                <h3>{props.title}</h3>
                <p>Serving size: {props.servings}</p>
            </div>
        </div>
    );
}
import "./RecipeCard.css"

export default function RecipeCard(props) {
    return (
        <div className="recipe-card">
            <div className="recipe-img">
                <img src={props.image}></img>

            </div>
            <div className="recipe-content">
                <div className="recipe-text">
                    <h3>{props.title}</h3>
                    <p>Serving size: {props.servings}</p>
                    <p>Preparation time(minutes): {props.readyInMinutes}</p>
                </div>
                <div className="dietary-indicators">
                    {
                        (props.vegetarian)
                        ? <p className="diet-green">Vegetarian ✔</p>
                        : <p className="diet-red">Vegetarian ✖</p>
                    }
                    {
                        (props.vegan)
                        ? <p className="diet-green">Vegan ✔</p>
                        : <p className="diet-red">Vegan ✖</p>
                    }
                    {
                        (props.glutenFree)
                        ? <p className="diet-green">Gluten-Free ✔</p>
                        : <p className="diet-red">Gluten-Free ✖</p>
                    }
                    {
                        (props.dairyFree)
                        ? <p className="diet-green">Dairy-Free ✔</p>
                        : <p className="diet-red">Dairy-Free ✖</p>
                    }
                </div>
            </div>
            <div className="recipe-action-col">
                {/* <button className="recipe-save-btn" onClick={(event)=>{
                    event.preventDefault();
                    props.func(props.recipeId);
                }}>Save recipe ☆</button> */}
                {
                    (props.check(props.recipeId))
                    ?
                    <button className="recipe-saved-btn" onClick={(event)=>{
                        event.preventDefault();
                        props.unsaveFunc(props.recipeId);
                    }}>Unsave recipe ★</button>
                    :
                    <button className="recipe-save-btn" onClick={(event)=>{
                        event.preventDefault();
                        props.saveFunc(props.recipeId);
                    }}>Save recipe ☆</button>
                }
            </div>
        </div>
    );
}
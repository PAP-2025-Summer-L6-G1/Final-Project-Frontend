import "./RecipeCard.css"
import { useState, useEffect } from "react";

export default function RecipeCard(props) {
    const [showPopup, setShowPopup] = useState(false);

    const popUpFunc = () => {
        setShowPopup(true);
    };

    const closePopup = (event) => {
        event.stopPropagation(); //If you have a button inside a div, and both have click event listeners, clicking the button would normally trigger both the button's click handler and then the div's click handler (due to bubbling). If you call event.stopPropagation() in the button's click handler, the div's click handler will not be executed.
        setShowPopup(false);
    };

    return (
        <div className="recipe-card" onClick={()=> popUpFunc()}>
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
            {showPopup && (
                <div className="recipe-popup" onClick={closePopup}>
                    <div className="recipe-popup-content" onClick={e => e.stopPropagation()}>
                        <button className="close-popup" onClick={closePopup}>Close</button>
                        <h3>{props.title}</h3>
                        <div dangerouslySetInnerHTML={{ __html: props.sum }} />
                    </div>
                </div>
            )}
        </div>
    );
}
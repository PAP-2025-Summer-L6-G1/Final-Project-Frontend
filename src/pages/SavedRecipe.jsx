import { Link } from 'react-router-dom'
import { useState, useEffect } from "react";
import Navbar from '../components/Navbar.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import { useSavedRecipes } from '../hooks/useSavedRecipes.js';

function SavedRecipe() {
    const { SavedRecipes, fetchSavedRecipes, saveRecipe, unsaveRecipe, checkIfSaved } = useSavedRecipes();

    return (
        <>
            <Navbar/>
            <main>
                <Link to="/recipes"><button>Back to recipes</button></Link>
                {SavedRecipes.map((recipe) => {
                    return (
                        <RecipeCard
                            key={recipe.id}
                            recipeId={recipe.id}
                            saveFunc={saveRecipe}
                            unsaveFunc={unsaveRecipe}
                            check={checkIfSaved}
                            image={recipe.image}
                            title={recipe.title}
                            servings={recipe.servings}
                            readyInMinutes={recipe.readyInMinutes}
                            vegetarian={recipe.vegetarian}
                            vegan={recipe.vegan}
                            glutenFree={recipe.glutenFree}
                            dairyFree={recipe.dairyFree} />
                    )
                }
                )}
            </main>
        </>
    )
}

export default SavedRecipe
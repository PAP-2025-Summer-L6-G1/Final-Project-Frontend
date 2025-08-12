import { Link } from 'react-router-dom'
import { useState, useEffect } from "react";
import Navbar from '../components/Navbar.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import { useSavedRecipes } from '../hooks/useSavedRecipes.js';
import './SavedRecipe.css'

function SavedRecipe() {
    const { SavedRecipes, fetchSavedRecipes, saveRecipe, unsaveRecipe, checkIfSaved } = useSavedRecipes();

    return (
        <>
            <Navbar/>
            <main>
                <div className='saved-recipes-header'>
                    <h1 class="saved-recipes-title">Saved Recipes</h1>
                    <Link to="/recipes"><button id='recipes-btn'>Back to recipes ⇨</button></Link>
                </div>
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
                            dairyFree={recipe.dairyFree}
                            sum={recipe.summary}
                        />
                    )
                }
                )}
            </main>
        </>
    )
}

export default SavedRecipe
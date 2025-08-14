import { Link } from 'react-router-dom'
import { useState, useEffect } from "react";
import Navbar from '../components/Navbar.jsx'
import RecipeCard from '../components/RecipeCard.jsx'
import { useSavedRecipes } from '../hooks/useSavedRecipes.js';
import './SavedRecipe.css'
import AccountContext from '../contexts/AccountContext.jsx'
import { signupUser, loginUser, logoutUser, loadLocalAccountData } from '../api/signIn.jsx'

function SavedRecipe() {
    const { SavedRecipes, fetchSavedRecipes, saveRecipe, unsaveRecipe, checkIfSaved } = useSavedRecipes();
    const [loggedInUser, setLoggedInUser] = useState("");
    useEffect(() => {
        loadLocalAccountData(setLoggedInUser);
        fetchSavedRecipes();
    }, [])

    // console.log('SavedRecipes state:', Array.isArray(SavedRecipes) ? `${SavedRecipes.length} items` : (SavedRecipes === null ? 'loading' : typeof SavedRecipes));

    return (
        <>
            <AccountContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
                <Navbar />
            </AccountContext.Provider>
            <main>
                <div className='saved-recipes-header'>
                    <h1 className="saved-recipes-title">Saved Recipes</h1>
                    <Link to="/recipes"><button id='recipes-btn'>Back to recipes ⇨</button></Link>
                </div>
                {
                    SavedRecipes === null ?
                    (
                        <p>Loading saved recipes…</p>
                    )
                    :
                    SavedRecipes && SavedRecipes.length !== 0 ?
                    (SavedRecipes.map((recipe) => {
                        return (
                            <RecipeCard
                                key={recipe.id}
                                recipeId={recipe.id}
                                recipeObj={recipe}
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
                    })
                    )
                    :
                    <p>Saved recipes could not be found.</p>
                }
            </main>
        </>
    )
}

export default SavedRecipe
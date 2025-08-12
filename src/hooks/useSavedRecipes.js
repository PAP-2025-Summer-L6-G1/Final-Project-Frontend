//this is a hook containing functions and states for the saved recipes feature

import { useState, useEffect } from "react";

export function useSavedRecipes() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const [SavedRecipes, setSavedRecipes] = useState([]);

    const fetchSavedRecipes = () => {
        fetch(`https://localhost:3002/recipe/search/${localStorage.getItem("userId")}`)
            .then(response => response.json())
            .then(async result => {
                const recipeIds = result.map(obj => obj.recipeId);
                // Fetch full details for each recipeId
                const recipes = await Promise.all(
                    recipeIds.map(id =>
                        fetch(`https://localhost:3002/recipe/details/${id}`)
                            .then(res => res.json())
                    )
                );
                setSavedRecipes(recipes);
            })
            .catch(error => console.log('error', error));
    };

    useEffect(() => {
        fetchSavedRecipes();
    }, []);

    const saveRecipe = (recipeId)=> {
        // const params = new URLSearchParams({
            //     apiKey: process.env.SPOONACULAR_KEY,
        //     includeNutrition: "false"
        // });
        // fetch(`https://localhost:3002/recipe/search/${recipeId}/information?${params}`)
        var raw = JSON.stringify({
            "ownerId": localStorage.getItem("userId"),
            "recipeId": recipeId
        });
        var requestOptions = {
            method: 'POST',
            body: raw,
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`https://localhost:3002/recipe/save`, requestOptions)
        .then(response => response.json())
        .then(() => fetchSavedRecipes()) //refresh saved recipes
        .catch(error => console.log('error', error));
    }
    
    const unsaveRecipe = (recipeId)=> {
        var raw = JSON.stringify({
            "ownerId": localStorage.getItem("userId"),
            "recipeId": recipeId
        });
        var requestOptions = {
            method: 'DELETE',
            body: raw,
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch(`https://localhost:3002/recipe/unsave`, requestOptions)
        .then(response => response.json())
        .then(() => fetchSavedRecipes()) //refresh saved recipes
        .catch(error => console.log('error', error));
    }

    const checkIfSaved = (recipeId)=>{
        // return SavedRecipes.includes(recipeId);
        return SavedRecipes.some(recipe => recipe.id === recipeId);
    }

    return { SavedRecipes, fetchSavedRecipes, saveRecipe, unsaveRecipe, checkIfSaved };
}
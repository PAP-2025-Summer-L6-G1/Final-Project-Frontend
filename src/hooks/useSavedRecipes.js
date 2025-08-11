import { useState, useEffect } from "react";

export function useSavedRecipes() {
    const [savedRecipes, setSavedRecipes] = useState([]);

    const fetchSavedRecipes = () => {
        fetch(`https://localhost:3002/recipe/search/${localStorage.getItem("userId")}`)
            .then(response => response.json())
            .then(result => {
                const recipeIds = result.map(obj => obj.recipeId);
                setSavedRecipes(recipeIds);
            })
            .catch(error => console.log('error', error));
    };

    useEffect(() => {
        fetchSavedRecipes();
    }, []);

    return { savedRecipes, fetchSavedRecipes };
}
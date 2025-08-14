// //this is a hook containing functions and states for the saved recipes feature

// import { useState, useEffect } from "react";

// export function useSavedRecipes() {
//     var myHeaders = new Headers();
//     myHeaders.append("Content-Type", "application/json");

//     const [SavedRecipes, setSavedRecipes] = useState(null); // null = loading/unknown, [] = loaded but empty
//     // let SavedRecipes = [];

//     const fetchSavedRecipes = async () => {
//         try {
//             console.log("hit database");
//             const response1 = await fetch(`https://localhost:3002/recipe/search/${localStorage.getItem("userId")}`)
//             if(!response1.ok) {
//                 throw new Error(`HTTP error! status: ${response1.status}`);
//             }
//             const result = await response1.json();

//             const recipeIds = result.map(obj => obj.recipeId);
            
//             var raw = JSON.stringify({
//                 "recipeIds": recipeIds
//             });
//             var requestOptions = {
//                 method: 'POST',
//                 body: raw,
//                 headers: myHeaders,
//                 redirect: 'follow'
//             };

//             console.log("hit api(fetching recipe details)");
//             const response2 = await fetch("https://localhost:3002/recipe/saved", requestOptions)
//             if (!response2.ok) {
//                 throw new Error(`HTTP error! status: ${response2.status}`);
//             }
//             const recipes = await response2.json();
//             // SavedRecipes = recipes;
//             setSavedRecipes(recipes);

//             console.log("Saved Recipes:", recipes);
//         } catch(error) {
//             console.log('there was a problem with fetching:', error);
//         }
//     };

//     // fetchSavedRecipes();

//     const saveRecipe = (recipeObj)=> {
//         // const params = new URLSearchParams({
//             //     apiKey: process.env.SPOONACULAR_KEY,
//         //     includeNutrition: "false"
//         // });
//         // fetch(`https://localhost:3002/recipe/search/${recipeId}/information?${params}`)
//         var raw = JSON.stringify({
//             "ownerId": localStorage.getItem("userId"),
//             "recipeId": recipeObj.id
//         });
//         var requestOptions = {
//             method: 'POST',
//             body: raw,
//             headers: myHeaders,
//             redirect: 'follow'
//         };
//         console.log("hit database");
//         fetch(`https://localhost:3002/recipe/save`, requestOptions)
//         .then(response => response.json())
//         // .then(() => fetchSavedRecipes()) //refresh saved recipes
//         .then(() => setSavedRecipes(prev => [...prev, recipeObj])) //refresh saved recipes
//         .catch(error => console.log('error', error));
//     }
    
//     const unsaveRecipe = (recipeObj)=> {
//         var raw = JSON.stringify({
//             "ownerId": localStorage.getItem("userId"),
//             "recipeId": recipeObj.recipeId
//         });
//         var requestOptions = {
//             method: 'DELETE',
//             body: raw,
//             headers: myHeaders,
//             redirect: 'follow'
//         };
//         console.log("hit database");
//         fetch(`https://localhost:3002/recipe/unsave`, requestOptions)
//         .then(response => response.json())
//         // .then(() => fetchSavedRecipes()) //refresh saved recipes
//         .then(() => setSavedRecipes(prev => prev.filter(recipe => recipe.recipeId !== recipeObj.recipeId)))
//         .catch(error => console.log('error', error));
//     }

//     const checkIfSaved = (recipeId)=>{
//         // return SavedRecipes.includes(recipeId);
//         return SavedRecipes.some(recipe => recipe.id === recipeId);
//     }

//     return { SavedRecipes, fetchSavedRecipes, saveRecipe, unsaveRecipe, checkIfSaved };
// }


// useSavedRecipes.jsx
import { useState } from "react";

export function useSavedRecipes() {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // null = loading/unknown, [] = loaded but empty
  const [SavedRecipes, setSavedRecipes] = useState(null);

  // helper to ensure every saved recipe has an `id` property
  const normalize = (r) => {
    // r might be: { id: 123, ... } from spoonacular
    // or { recipeId: 123, ... } from your DB
    const id = r.id ?? r.recipeId ?? r.recipe_id ?? r.recipeID;
    return { ...r, id };
  };

  const fetchSavedRecipes = async () => {
    try {
      console.log("hit database");
      // fetch list of saved entries (server endpoint seems to return saved entries)
      const response1 = await fetch(
        `https://localhost:3002/recipe/search/${localStorage.getItem("userId")}`
      );
      if (!response1.ok) throw new Error(`HTTP error! status: ${response1.status}`);
      const result = await response1.json(); // result likely contains { recipeId } entries

      // map out recipeIds (handle empty)
      const recipeIds = (result || []).map((obj) => obj.recipeId ?? obj.id);

      if (recipeIds.length === 0) {
        // set to empty array (not null — means loaded but empty)
        setSavedRecipes([]);
        return;
      }

      const raw = JSON.stringify({ recipeIds });
      const requestOptions = {
        method: "POST",
        body: raw,
        headers: myHeaders,
        redirect: "follow",
      };

      console.log("hit api(fetching recipe details)");
      const response2 = await fetch("https://localhost:3002/recipe/saved", requestOptions);
      if (!response2.ok) throw new Error(`HTTP error! status: ${response2.status}`);
      const recipes = await response2.json();

      // normalize server recipe objects to always include `id`
      const normalized = (recipes || []).map(normalize);
      setSavedRecipes(normalized);
      console.log("Saved Recipes:", normalized);
    } catch (error) {
      console.log("there was a problem with fetching:", error);
      // on error, set to empty array to avoid stuck null; (optional: keep as null)
      setSavedRecipes([]);
    }
  };

  const saveRecipe = async (recipeObj) => {
    try {
      const recipeId = recipeObj.id ?? recipeObj.recipeId;
      const raw = JSON.stringify({
        ownerId: localStorage.getItem("userId"),
        recipeId,
      });
      const requestOptions = {
        method: "POST",
        body: raw,
        headers: myHeaders,
        redirect: "follow",
      };
      console.log("hit database - save");
      const res = await fetch(`https://localhost:3002/recipe/save`, requestOptions);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      // update local state WITHOUT re-fetching
      const newItem = normalize(recipeObj);
      setSavedRecipes((prev) => {
        // if prev is null (not loaded yet), initialize with the new item
        if (!Array.isArray(prev)) return [newItem];
        // avoid duplicates
        const filtered = prev.filter((p) => p.id != newItem.id);
        return [...filtered, newItem];
      });
    } catch (error) {
      console.log("error saving recipe:", error);
    }
  };

  const unsaveRecipe = async (recipeObj) => {
    try {
      const recipeId = recipeObj.id ?? recipeObj.recipeId;
      const raw = JSON.stringify({
        ownerId: localStorage.getItem("userId"),
        recipeId,
      });
      const requestOptions = {
        method: "DELETE",
        body: raw,
        headers: myHeaders,
        redirect: "follow",
      };
      console.log("hit database - unsave");
      const res = await fetch(`https://localhost:3002/recipe/unsave`, requestOptions);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      setSavedRecipes((prev) => (Array.isArray(prev) ? prev.filter((p) => p.id != recipeId) : []));
    } catch (error) {
      console.log("error unsaving recipe:", error);
    }
  };

  const checkIfSaved = (recipeId) => {
    // treat null as "not loaded" -> return false so UI shows Save button,
    // but once loaded it'll be accurate
    if (!Array.isArray(SavedRecipes)) return false;
    // use loose equality to accept string/number matches
    return SavedRecipes.some((r) => r.id != null && r.id == recipeId);
  };

  return { SavedRecipes, fetchSavedRecipes, saveRecipe, unsaveRecipe, checkIfSaved };
}

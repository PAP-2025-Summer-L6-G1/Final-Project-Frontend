import { useState } from 'react'
import './Recipe.css'
import Navbar from '../components/Navbar.jsx'
import AccountContext from '../contexts/AccountContext.jsx'
import { signupUser, loginUser, logoutUser, loadLocalAccountData } from '../api/signIn.jsx'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import RecipeCard from '../components/RecipeCard.jsx'

function Recipe() {
    let test = [
        {
            "id": 715415,
            "image": "https://img.spoonacular.com/recipes/715415-312x231.jpg",
            "imageType": "jpg",
            "title": "Red Lentil Soup with Chicken and Turnips",
            "readyInMinutes": 55,
            "servings": 8,
            "sourceUrl": "https://www.pinkwhen.com/red-lentil-soup-with-chicken-and-turnips/",
            "vegetarian": false,
            "vegan": false,
            "glutenFree": true,
            "dairyFree": true,
            "veryHealthy": true,
            "cheap": false,
            "veryPopular": true,
            "sustainable": false,
            "lowFodmap": false,
            "weightWatcherSmartPoints": 11,
            "gaps": "no",
            "preparationMinutes": 10,
            "cookingMinutes": 45,
            "aggregateLikes": 1866,
            "healthScore": 100,
            "creditsText": "pinkwhen.com",
            "license": null,
            "sourceName": "pinkwhen.com",
            "pricePerServing": 300.45,
            "summary": "Red Lentil Soup with Chicken and Turnips might be a good recipe to expand your main course repertoire. This recipe serves 8 and costs $3.0 per serving. One serving contains <b>477 calories</b>, <b>27g of protein</b>, and <b>20g of fat</b>. It is brought to you by Pink When. 1866 people have tried and liked this recipe. It can be enjoyed any time, but it is especially good for <b>Autumn</b>. From preparation to the plate, this recipe takes approximately <b>55 minutes</b>. It is a good option if you're following a <b>gluten free and dairy free</b> diet. Head to the store and pick up salt and pepper, canned tomatoes, flat leaf parsley, and a few other things to make it today. Overall, this recipe earns a <b>spectacular spoonacular score of 99%</b>. If you like this recipe, you might also like recipes such as <a href=\"https://spoonacular.com/recipes/red-lentil-and-chicken-soup-682185\">Red Lentil and Chicken Soup</a>, <a href=\"https://spoonacular.com/recipes/red-lentil-and-chicken-soup-1058971\">Red Lentil and Chicken Soup</a>, and <a href=\"https://spoonacular.com/recipes/red-lentil-soup-34121\">Red-Lentil Soup</a>.",
            "cuisines": [],
            "dishTypes": [
                "lunch",
                "soup",
                "main course",
                "main dish",
                "dinner"
            ],
            "diets": [
                "gluten free",
                "dairy free"
            ],
            "occasions": [
                "fall",
                "winter"
            ],
            "spoonacularScore": 99.42810821533203,
            "spoonacularSourceUrl": "https://spoonacular.com/red-lentil-soup-with-chicken-and-turnips-715415"
        }
    ]
    
    const [Recipes, SetRecipes] = useState(test);
    const [RecipeSearch, SetRecipeSearch] = useState("");
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const onSearchSubmit = (event)=> {
        var raw = JSON.stringify({
        "query": RecipeSearch,
        "ingreds": [
            "cheese"
        ]
        });
    
        var requestOptions = {
        method: 'POST',
        body: raw,
        headers: myHeaders,
        redirect: 'follow'
        };
        
        event.preventDefault();
        console.log(RecipeSearch);
        fetch("https://localhost:3002/recipe/search", requestOptions)
        .then(response => response.json())
        .then(result => SetRecipes(result.results))
        .catch(error => console.log('error', error));
    }

    return (
        <>
            <main>
                <form onSubmit={onSearchSubmit}>
                    <input type='text' placeholder='Search recipe' value={RecipeSearch} onChange={(event)=>{
                        SetRecipeSearch(event.target.value);
                    }}></input>
                    <button type='submit'>Search</button>
                </form>

                <Link to="/recipe/saved-recipes"><h2>Saved recipes</h2></Link>

                <input type='text' id='filterIngreds' placeholder='Filter by ingredient'></input>

                {/*setRecipes calls a rerender which calls .map again*/}
                {Recipes.map((recipe)=>{ return <RecipeCard key={recipe.id} image={recipe.image} title={recipe.title} servings={recipe.servings}/> })}

            </main>
        </>
    )
}

export default Recipe
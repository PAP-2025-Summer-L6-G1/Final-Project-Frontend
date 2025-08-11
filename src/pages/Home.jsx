import { useState } from 'react'
import './Home.css'
import Navbar from '../components/Navbar.jsx'
import AccountContext from '../contexts/AccountContext.jsx'
import {signupUser, loginUser, logoutUser, loadLocalAccountData} from '../api/signIn.jsx'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import fridgeIcon from "../assets/Fridge.svg"
import veggieIcon from "../assets/veggie-bag.png"
import healthIcon from "../assets/health-weight.png"
import cookingIcon from "../assets/cooking.png"
import budgetIcon from "../assets/budget.png"
import groceryScene from "../assets/grocery.jpg"
import HomepageCard from '../components/HomepageCard.jsx'
function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
    loadLocalAccountData(setLoggedInUser);
  }, [])
  return (
    <>
      <AccountContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
        <Navbar />
      </AccountContext.Provider>
      <main>
        <img id="homepage-background" src={groceryScene} />
        <section className='card-container'>
          <HomepageCard
            to="/inventory"
            icon={fridgeIcon}
            title="Inventory"
            desc="See what you have in stock"
          />

          <HomepageCard
            to="/grocery"
            icon={veggieIcon}
            title="Grocery List"
            desc="Add an item to your inventory"
          />

          <HomepageCard
            to="/health"
            icon={healthIcon}
            title="Health"
            desc="Keeping track of your health"
          />

          <HomepageCard
            to="/recipes"
            icon={cookingIcon}
            title="Recipes"
            desc="Ready to make some food with ingredients in your inventory?"
          />

          <HomepageCard
            to="/budget"
            icon={budgetIcon}
            title="Budget Tracker"
            desc="Keeping track of your budget"
          />
        </section>

      </main>
    </>
  )
}

export default Home

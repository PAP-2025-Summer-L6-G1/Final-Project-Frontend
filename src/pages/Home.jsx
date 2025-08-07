import { useState } from 'react'
import './Home.css'
import Navbar from '../components/Navbar.jsx'
import AccountContext from '../contexts/AccountContext.jsx'
import { signupUser, loginUser, logoutUser, loadLocalAccountData } from '../api/signIn.jsx'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Logo from "../assets/logo.svg"
function Home() {
  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
    loadLocalAccountData(setLoggedInUser);
  }, [])
  return (
    <>
      <AccountContext.Provider value={{ loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser }}>
        <Navbar />
      </AccountContext.Provider>
      <main>
        <div className='card-container'>

          <div className='card'>
            <Link to="/inventory">
              <h2>
              
                Inventory
              </h2>
            </Link>
            <p></p>
          </div>
          <div className='card'>
            <Link to="/grocery">
              <h2>
              
                Grocery List
              </h2>
            </Link>
            <p></p>
          </div>
          <div className='card'>
            <Link to="/health">
              <h2>
              
                Health
              </h2>
            </Link>
            <p></p>
          </div>
          <div className='card'>
            <Link to="/recipes">
              <h2>
              
                Recipes
              </h2>
            </Link>
            <p></p>
          </div>
          <div className='card'>
            <Link to="/budget">
              <h2>
              
                Budget Tracker
              </h2>
            </Link>
            <p></p>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home

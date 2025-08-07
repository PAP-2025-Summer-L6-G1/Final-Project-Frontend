import { useState } from 'react'
import './Home.css'
import Navbar from '../components/Navbar.jsx'
import AccountContext from '../contexts/AccountContext.jsx'
import {signupUser, loginUser, logoutUser, loadLocalAccountData} from '../api/signIn.jsx'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import freezerIcon from "../assets/Freezer.svg"
import groceryScene from "../assets/grocery.jpg"
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
        <div className='card-container'>
          <div className='homepage-card'>
            <img src={freezerIcon} className="homepage-card-icon" />
            <div className="homepage-card-text">
              <Link to="/inventory"><h2>Inventory</h2></Link>
              <p>Description</p>
            </div>
          </div>

          <div className='homepage-card'>
            <img src={freezerIcon} className="homepage-card-icon" />
            <div className="homepage-card-text">
              <Link to="/grocery"><h2>Grocery List</h2></Link>
              <p>Description</p>
            </div>
          </div>

          <div className='homepage-card'>
            <img src={freezerIcon} className="homepage-card-icon" />
            <div className="homepage-card-text">
              <Link to="/health"><h2>Health</h2></Link>
              <p>Description</p>
            </div>
          </div>

          <div className='homepage-card'>
            <img src={freezerIcon} className="homepage-card-icon" />
            <div className="homepage-card-text">
              <Link to="/recipes"><h2>Recipes</h2></Link>
              <p>Description</p>
            </div>
          </div>

          <div className='homepage-card'>
            <img src={freezerIcon} className="homepage-card-icon" />
            <div className="homepage-card-text">
              <Link to="/budget"><h2>Budget Tracker</h2></Link>
              <p>Description</p>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home

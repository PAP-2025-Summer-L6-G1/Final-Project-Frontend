import { useState } from 'react'
import './App.css'
import Navbar from '../components/Navbar.jsx'
import HealthDashboard from './HealthDashboard.jsx'
import AccountContext from '../contexts/AccountContext.jsx'
import {signupUser, loginUser, logoutUser, loadLocalAccountData, saveLocalAccountData, clearLocalAccountData} from '../api/signIn.jsx'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
//import signin from './api/signIn.jsx'
function App() {
  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
    const initializeAuth = async () => {
      await loadLocalAccountData(setLoggedInUser);
    };
    initializeAuth();
  }, [])
  return (
    <>
      <AccountContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
        <Navbar />
        <Outlet />  
      </AccountContext.Provider>
    </>
  )
}

export default App

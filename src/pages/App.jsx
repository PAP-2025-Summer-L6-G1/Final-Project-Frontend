import { useState } from 'react'
import './App.css'
import Navbar from '../components/Navbar.jsx'
import AccountContext from '../contexts/AccountContext.jsx'
import {signupUser, loginUser, logoutUser, loadLocalAccountData, saveLocalAccountData, clearLocalAccountData} from '../api/signIn.jsx'
import { useEffect } from 'react'
//import signin from './api/signIn.jsx'
function App() {
  const [loggedInUser, setLoggedInUser] = useState("");
  useEffect(() => {
    loadLocalAccountData(setLoggedInUser);
  }, [])
  return (
    <>
      <AccountContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
        <Navbar />
      </AccountContext.Provider>
    </>
  )
}

export default App

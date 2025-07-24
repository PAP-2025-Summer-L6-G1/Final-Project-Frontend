import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import AccountContext from './contexts/AccountContext'
import {signupUser, loginUser, logoutUser, loadLocalAccountData, saveLocalAccountData, clearLocalAccountData} from './api/signIn.jsx'
//import signin from './api/signIn.jsx'
function App() {
  //console.log(signin)
  const [loggedInUser, setLoggedInUser] = useState("");
  console.log(loggedInUser)
  return (
    <>
      <AccountContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
        <Navbar />
      </AccountContext.Provider>
    </>
  )
}

export default App

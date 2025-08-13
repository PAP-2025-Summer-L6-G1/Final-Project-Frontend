import { useState, useEffect} from 'react'

//Apis
import {signupUser, loginUser, logoutUser, loadLocalAccountData} from './api/signIn.jsx'

//Context
import AccountContext from './contexts/AccountContext.jsx'

import Home from './pages/Home.jsx'
import Storage from './pages/storagePage.jsx'
import List from './pages/List.jsx'
import HealthDashboard from './pages/HealthDashboard.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Budget from './pages/Budget.jsx'
import Recipe from './pages/Recipe.jsx'
import SavedRecipe from './pages/SavedRecipe.jsx'
import Navbar from './components/Navbar.jsx'

import './index.css'


const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/inventory",
    element: <Storage />
  },
  {
    path: "/grocery",
    element: <List />
  },
  {
  path: "/health",
  element: <HealthDashboard />,
  },
  {
  path: "/recipes",
  element: <Recipe />,
  },
  {
  path: "/budget",
  element: <Budget />,
  },
  {
    path: "/recipe/saved-recipes",
    element: <SavedRecipe/>
  }
])

function App() {


    return (
            <RouterProvider router={router} />
    )
}

export default App
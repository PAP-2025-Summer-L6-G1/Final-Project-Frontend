import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import Storage from './pages/storagePage.jsx'
import List from './pages/List.jsx'
import HealthDashboard from './pages/HealthDashboard.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Budget from './pages/Budget.jsx'
import Recipe from './pages/Recipe.jsx'
import SavedRecipe from './pages/SavedRecipe.jsx'

const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Home />,
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


createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)

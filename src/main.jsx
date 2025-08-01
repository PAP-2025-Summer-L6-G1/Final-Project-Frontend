import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Budget from './pages/budget.jsx'
import Recipe from './pages/Recipe.jsx'


const router = createBrowserRouter([
  {
  path: "/",
  element: <Home />,
  },
  {
  path: "/inventory",
  element: <Home />,
  },
  {
  path: "/grocery",
  element: <Home />,
  },
  {
  path: "/health",
  element: <Home />,
  },
  {
  path: "/recipes",
  element: <Recipe />,
  },
  {
  path: "/budget",
  element: <Budget />,
  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import Storage from './pages/storagePage.jsx'
import List from './pages/List.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"


const router = createBrowserRouter([
  
  {
    path: "/",
    element: <Home />,
  },
  {
  path: "/health",
  element: <Home />,
  },
  {
  path: "/recipes",
  element: <Home />,
  },
  {
  path: "/budget",
  element: <Home />,
  },

  {
    path: "/grocery",
    element: <List />
  },
  {
    path: "/inventory",
    element: <Storage />
  },
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

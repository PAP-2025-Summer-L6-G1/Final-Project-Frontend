import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Budget from './pages/budget.jsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <StrictMode>
      <Home />
    </StrictMode>,
  },
  {
    path: "/inventory",
    element: <StrictMode>
      <Home />
    </StrictMode>,
  },
  {
    path: "/grocery",
    element: <StrictMode>
      <Home />
    </StrictMode>,
  },
  {
    path: "/health",
    element: <StrictMode>
      <Home />
    </StrictMode>,
  },
  {
    path: "/recipes",
    element: <StrictMode>
      <Home />
    </StrictMode>,
  },
  {
    path: "/budget",
    element: <Budget />,
  },
])


createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
)

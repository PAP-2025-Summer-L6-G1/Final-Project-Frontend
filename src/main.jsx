import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './pages/App.jsx'
import Storage from './pages/storagePage.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"


const router = createBrowserRouter([{
  path: "/",
  element: <App />,
  },
  {
    path: "/storage",
    element: <Storage />
  }
])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

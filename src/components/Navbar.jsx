import logo from "../assets/logo.svg"
import "./Navbar.css"
import Accounts from "./Login.jsx"
import {Link} from "react-router-dom"

export default function Navbar() {
    return (
        <header className="navbar">
            <nav>
                <Link to="/"><img src={logo} className="logo"/></Link>
                <Link to="/inventory">Inventory</Link>
                <Link to="/grocery">Grocery</Link>
                <Link to="/health">Health</Link>
                <Link to="/recipes">Recipes</Link>
                <Link to="/budget">Budget</Link>
            </nav>
            <Accounts/>
        </header>
    )
}
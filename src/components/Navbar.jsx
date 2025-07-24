import logo from "../assets/logo.svg"
import "./Navbar.css"
import Accounts from "./Login.jsx"
import {Link} from "react-router-dom"

export default function Navbar() {
    return (
        <header className="navbar">
            <img src={logo} className="logo"/>
            <nav>
                <Link to="/">Main Page</Link>
            </nav>
            <Accounts/>
        </header>
    )
}
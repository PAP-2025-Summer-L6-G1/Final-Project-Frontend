import logo from "../assets/logo.svg"
import "./Navbar.css"
import Accounts from "./Login.jsx"
import {Link} from "react-router-dom"
import { useContext } from "react"
import AccountContext from "../contexts/AccountContext"

export default function Navbar() {
    const { loggedInUser } = useContext(AccountContext);
    
    return (
        <header className="navbar">
            <nav>
                <Link to="/">
                <img src={logo} className="logo"/>
                </Link>
            </nav>
            {loggedInUser && (
                    <div className="nav-links">
                        <Link to="/health" className="nav-link">
                            Health Dashboard
                        </Link>
                    </div>
                )}
            <Accounts/>
        </header>
    )
}
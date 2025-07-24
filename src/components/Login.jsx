import { useEffect } from "react";
import "./Login.css"


export default function Accounts(props) {
    let loggedIn = false;
    useEffect(()=>{},[loggedIn])
    return (
        <nav>
                    {loggedIn /*check for login status*/ ? <><p>account name</p><button className="log-out">Log Out</button></>: <button className="sign-in">Sign In</button>}
        </nav>
    )
}
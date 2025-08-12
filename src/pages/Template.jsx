/* This page is just to show the bare minimum code to make a page with a navbar */
import AccountContext from "../contexts/AccountContext";
import {signupUser, loginUser, logoutUser, loadLocalAccountData} from '../api/signIn.jsx'
import { useState } from "react";

export default function Template() {
    const [loggedInUser, setLoggedInUser] = useState("");
          useEffect(() => {
            loadLocalAccountData(setLoggedInUser);
          }, [])
    return (
        <>
            <AccountContext.Provider value={{loggedInUser, setLoggedInUser, signupUser, loginUser, logoutUser}}>
                <Navbar />
            </AccountContext.Provider>
        </>
    )
}
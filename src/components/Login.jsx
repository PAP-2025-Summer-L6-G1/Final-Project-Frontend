import { useEffect, useContext, useState } from "react";
import "./Login.css"
import AccountContext from "../contexts/AccountContext";



export default function Accounts() {
    const accountContext = useContext(AccountContext);

    const [signupDialogOpen, setSignupDialogOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [signupUsername, setSignupUsername] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    function handleSignupClick(event) {
        setSignupDialogOpen(true);
    }

    function handleSignupCloseClick(event) {
        setSignupDialogOpen(false);
    }

    function handleLoginClick(event) {
        setLoginDialogOpen(true);
    }

    function handleLoginCloseClick(event) {
        setLoginDialogOpen(false);
    }

    function handleLogoutClick(event) {
        accountContext.logoutUser(accountContext.setLoggedInUser);
    }

    async function handleSignupSubmit(event) {
        event.preventDefault();
        const success = await accountContext.signupUser({
            username: signupUsername,
            password: signupPassword
        }, accountContext.setLoggedInUser);

        if (success) {
            setSignupDialogOpen(false);
        }
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();

        const success = await accountContext.loginUser({
            username: loginUsername,
            password: loginPassword
        }, accountContext.setLoggedInUser);

        if (success) {
            setLoginDialogOpen(false);
        }
    }

    return (
        <>
            <dialog open={signupDialogOpen} id="sign-up-modal">
                <article>
                    <header>
                        <button
                            className="close-modal"
                            aria-label="Close"
                            rel="prev"
                            onClick={handleSignupCloseClick}
                        ></button>
                        <h2>Sign Up</h2>
                    </header>
                    <form
                        id="sign-up-form"
                        onSubmit={handleSignupSubmit}
                    >
                        <label htmlFor="new-username">Your Username</label>
                        <input
                            type="text"
                            id="new-username"
                            value={signupUsername}
                            onChange={(event) => setSignupUsername(event.target.value)}
                        />
                        <label htmlFor="new-password">Your Password</label>
                        <input
                            type="password"
                            id="new-password"
                            value={signupPassword}
                            onChange={(event) => setSignupPassword(event.target.value)}
                        />
                        <input type="submit" value="Sign Up" />
                    </form>
                </article>
            </dialog>
            <dialog open={loginDialogOpen} id="log-in-modal">
                <article>
                    <header>
                        <button
                            className="close-modal"
                            aria-label="Close"
                            rel="prev"
                            onClick={handleLoginCloseClick}
                        ></button>
                        <h2>Log in</h2>
                    </header>
                    <form
                        id="log-in-form"
                        onSubmit={handleLoginSubmit}
                    >
                        <label htmlFor="username">Your Username</label>
                        <input
                            type="text"
                            id="username"
                            value={loginUsername}
                            onChange={(event) => setLoginUsername(event.target.value)}
                        />
                        <label htmlFor="password">Your Password</label>
                        <input
                            type="password"
                            id="password"
                            value={loginPassword}
                            onChange={(event) => setLoginPassword(event.target.value)}
                        />
                        <input type="submit" value="Log in" />
                    </form>
                </article>
            </dialog>
            <nav id="utility">
                {
                    (accountContext.loggedInUser === "") ?
                        <div id="signup-login">
                            <button
                                id="sign-up-btn"
                                className="outline"
                                onClick={handleSignupClick}
                            >
                                Sign up
                            </button>
                            <button
                                id="log-in-btn"
                                onClick={handleLoginClick}
                            >
                                Log in
                            </button>
                        </div>
                        :
                        <div id="avatar-logout">
                            <span id="user-avatar"> {accountContext.loggedInUser}</span>{" "}
                            <button
                                id="log-out-btn"
                                className="outline"
                                onClick={handleLogoutClick}
                            >
                                Log out
                            </button>
                        </div>
                }
            </nav>
        </>
    );
}
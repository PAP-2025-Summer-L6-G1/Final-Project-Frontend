import { useEffect, useContext, useState } from "react";
import "./Login.css"
import AccountContext from "../contexts/AccountContext";
import { useRef } from "react";



export default function Accounts() {
    const accountContext = useContext(AccountContext);

    const signUpModal = useRef(null) // these reference the login and singup dialogs through the ref attribute
    const loginModal = useRef(null)

    const [alreadyExistingUser, setAlreadyExistingUser] = useState("none"); // these are used to set the display of the wrong login/signup information messages.
    const [wrongLogin, setWrongLogin] = useState("none"); // wrongLogin and alreadyExistingUser should always have a value of either "block" or "none";

    const [signupUsername, setSignupUsername] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    function openSignupModal() {
        if (signUpModal.current) {
            signUpModal.current.showModal()
        }
    }
    function closeSignupModal() {
        if (signUpModal.current) {
            signUpModal.current.close()
        }
    }
    function openLoginModal() {
        if (loginModal.current) {
            loginModal.current.showModal()
        }
    }
    function closeLoginModal() {
        if (loginModal.current) {
            loginModal.current.close()
        }
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
            setAlreadyExistingUser("none")
            closeSignupModal(false);
        }
        else if (!success) {
            setAlreadyExistingUser("block")
        }
    }

    async function handleLoginSubmit(event) {
        event.preventDefault();

        const success = await accountContext.loginUser({
            username: loginUsername,
            password: loginPassword
        }, accountContext.setLoggedInUser);

        if (success) {
            setWrongLogin("none")
            closeLoginModal();
        }
        else if (!success) {
            setWrongLogin("block")
        }
    }

    return (
        <>
            <dialog ref={signUpModal} id="sign-up-modal">
                <article>
                    <header>
                        <button
                            className="close-modal"
                            aria-label="Close"
                            rel="prev"
                            onClick={closeSignupModal}
                        >x</button>
                        <h2>Sign Up</h2>
                    </header>
                    <form
                        id="sign-up-form"
                        onSubmit={handleSignupSubmit}
                    >
                        <div className="form-inputs-container">
                            <label htmlFor="new-username">Your Username</label>
                            <input
                                type="text"
                                id="new-username"
                                value={signupUsername}
                                onChange={(event) => setSignupUsername(event.target.value)}
                                required
                                />
                            <label htmlFor="new-password">Your Password</label>
                            <input
                                type="password"
                                id="new-password"
                                value={signupPassword}
                                onChange={(event) => setSignupPassword(event.target.value)}
                                required
                                />
                            <p style={{display: alreadyExistingUser}} className="auth-error-message">Sorry, there is already a user with that username. Please choose a different username.</p>
                        </div>
                        <button type="submit">Sign Up</button>
                    </form>
                </article>
            </dialog>
            <dialog ref={loginModal} id="log-in-modal">
                <article>
                    <header>
                        <button
                            className="close-modal"
                            aria-label="Close"
                            rel="prev"
                            onClick={closeLoginModal}
                        >x</button>
                        <h2>Log in</h2>
                    </header>
                    <form
                        id="log-in-form"
                        onSubmit={handleLoginSubmit}
                    >
                        <div className="form-inputs-container">
                            <label htmlFor="username">Your Username</label>
                            <input
                                type="text"
                                id="username"
                                value={loginUsername}
                                onChange={(event) => setLoginUsername(event.target.value)}
                                required
                                />
                            <label htmlFor="password">Your Password</label>
                            <input
                                type="password"
                                id="password"
                                value={loginPassword}
                                onChange={(event) => setLoginPassword(event.target.value)}
                                required
                                />
                            <p style={{display: wrongLogin}} className="auth-error-message">Either your username or password did not match. Please try again.</p>
                        </div>
                        <button type="submit">Log in</button>
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
                                onClick={openSignupModal}
                            >
                                Sign up
                            </button>
                            <button
                                id="log-in-btn"
                                onClick={openLoginModal}
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
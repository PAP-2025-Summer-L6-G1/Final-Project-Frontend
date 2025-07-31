const hostURL = (process.env.NODE_ENV === "production") ? "https://cfa-summer2025-grocerybuddy-api.onrender.com" : "https://localhost:3002";;

const apiSignup = hostURL+ "/signup";
const apiLogin = hostURL+ "/login";
const apiLogout = hostURL+ "/logout";

const postSignupParams = {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  credentials: 'include'
};
const postLoginParams = {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  credentials: 'include'
};
const postLogoutParams = {
  headers: { 'Content-Type': 'application/json' },
  method: 'POST',
  credentials: 'include'
};

export async function signupUser(user, setLoggedInUser) {
  try {
    const postSignupParamsWithBody = {
      ...postSignupParams,
      body: JSON.stringify(user)
    };

    const response = await fetch(apiSignup, postSignupParamsWithBody);
    if (response.status === 201) {
      setLoggedInUser(user.username);
      saveLocalAccountData(user.username);

      return true;
    }
  } catch (error) {
    console.error(error);
  }

  return false;
}

export async function loginUser(user, setLoggedInUser) {
  try {
    const postLoginParamsWithBody = {
      ...postLoginParams,
      body: JSON.stringify(user)
    };

    const response = await fetch(apiLogin, postLoginParamsWithBody);
    if (response.status === 200) {
      setLoggedInUser(user.username);
      saveLocalAccountData(user.username);

      return true;
    }
  } catch (error) {
    console.error(error);
  }

  return false;
}

export async function logoutUser(setLoggedInUser) {
  try {
    const response = await fetch(apiLogout, postLogoutParams);
    if (response.status === 200) {
      setLoggedInUser("");
      clearLocalAccountData();

      return true;
    }
  } catch (error) {
    console.error(error);
  }

  return false;
}

export function loadLocalAccountData(setLoggedInUser) {
  const username = localStorage.getItem("username");
  if (username !== null) {
    setLoggedInUser(username);
  }
}

export function saveLocalAccountData(username) {
  localStorage.setItem("username", username);
}

export function clearLocalAccountData() {
  localStorage.removeItem("username");
}


//export default {signupUser, loginUser, logoutUser, loadLocalAccountData, saveLocalAccountData, clearLocalAccountData}
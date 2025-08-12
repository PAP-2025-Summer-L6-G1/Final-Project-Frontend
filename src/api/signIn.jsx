const hostURL = (process.env.NODE_ENV === "production") ? "https://cfa-summer2025-grocerybuddy-api.onrender.com" : "http://localhost:3002";

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
      const json = await response.json();
      saveLocalAccountData(user.username, json.userId);
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
      const json = await response.json();
      saveLocalAccountData(user.username, json.userId);

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

export async function loadLocalAccountData(setLoggedInUser) {
  const username = localStorage.getItem("username");
  if (username !== null) {
    // Verify that the user is still authenticated on the backend
    try {
      const response = await fetch(`${hostURL}/health/`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (response.status === 200) {
        // User is still authenticated
        setLoggedInUser(username);
      } else {
        // User is no longer authenticated, clear local data
        console.log('User session expired, clearing local data');
        clearLocalAccountData();
        setLoggedInUser("");
      }
    } catch (error) {
      // Network error or other issue, clear local data to be safe
      console.log('Error validating user session, clearing local data');
      clearLocalAccountData();
      setLoggedInUser("");
    }
  }
}

export function saveLocalAccountData(username, userId) {
  localStorage.setItem("username", username);
  localStorage.setItem("userId", userId)
}

export function clearLocalAccountData() {
  localStorage.removeItem("username");
}


//export default {signupUser, loginUser, logoutUser, loadLocalAccountData, saveLocalAccountData, clearLocalAccountData}
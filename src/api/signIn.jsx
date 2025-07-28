

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

 async function signupUser(user) {
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

  async function loginUser(user) {
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

  async function logoutUser() {
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

  function loadLocalAccountData() {
    const username = localStorage.getItem("username");
    if (username !== null) {
      setLoggedInUser(username);
    }
  }

  function saveLocalAccountData(username) {
    localStorage.setItem("username", username);
  }

  function clearLocalAccountData() {
    localStorage.removeItem("username");
  }

  async function newMessage(message) {
    try {
      message.date = (new Date()).toISOString();

      const postNewParamsWithBody = {
        ...postNewParams,
        body: JSON.stringify(message)
      };

      const response = await fetch(apiPostNew, postNewParamsWithBody);
      if (response.status === 201) {
        if (message.secret === isSecret) {
          showMessages([message, ...messages]);  
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  export default {signupUser, loginUser, logoutUser, loadLocalAccountData,saveLocalAccountData, clearLocalAccountData, newMessage}
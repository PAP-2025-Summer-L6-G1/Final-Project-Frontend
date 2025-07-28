import React from 'react';

const defaultValues = {
  loggedInUser: "",
  setLoggedInUser: null,
  signupUser: null,
  loginUser: null,
  logoutUser: null,
};

export default React.createContext(defaultValues);
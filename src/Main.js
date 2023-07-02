import { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage.js";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar.js";
import { ComeAwayApi } from "./api/api.js";
import UserContext from "./Auth/UserContext.js";
import jwt from "jsonwebtoken";

export const TOKEN_STORAGE_ID = "comeaway-token";

function Main() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);

  useEffect(
    function loadUserInfo() {
      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = jwt.decode(token);
            ComeAwayApi.token = token;
            let currentUser = await ComeAwayApi.getCurrentUser(username);
            setCurrentUser(currentUser);
          } catch (e) {
            setCurrentUser(null);
          }
        }
        setInfoLoaded(true);
      }
      setInfoLoaded(false);
      getCurrentUser();
    },
    [token]
  );

  async function signup(signupData) {
    try {
      let token = await ComeAwayApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  async function login(loginData) {
    try {
      let token = await ComeAwayApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  function logout() {
    try {
      setCurrentUser(null);
      setToken(null);
    } catch (errors) {
      return { success: false, errors };
    }
  }

  if (!infoLoaded) return;

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        signup,
        logout,
      }}
    >
      <NavBar />
      <Outlet />
    </UserContext.Provider>
  );
}

export default Main;

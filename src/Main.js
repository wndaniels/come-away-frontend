import { useState, useEffect } from "react";
import useLocalStorage from "./hooks/useLocalStorage";
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar";
import ComeAwayApi from "./api/api";
import UserContext from "./Auth/UserContext";
import jwt from "jsonwebtoken";

export const TOKEN_STORAGE_ID = "comeaway-token";

const Main = () => {
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

  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

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

  if (!infoLoaded) return;

  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        signup,
      }}
    >
      <NavBar />
      <Outlet />
    </UserContext.Provider>
  );
};

export default Main;

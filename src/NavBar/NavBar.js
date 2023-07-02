import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../Auth/UserContext.js";
import { ComeAwayApi } from "../api/api.js";
import useLocalStorage from "../hooks/useLocalStorage.js";
import jwt from "jsonwebtoken";

export const TOKEN_STORAGE_ID = "comeaway-token";

const NavBar = () => {
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [calUserId, setCalUserId] = useState([]);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [formError, setFormError] = useState([]);

  const { currentUser, setCurrentUser, logout } = useContext(UserContext);

  useEffect(
    function loadUserInfo() {
      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = jwt.decode(token);
            ComeAwayApi.token = token;
            let currentUser = await ComeAwayApi.getCurrentUser(username);
            setCurrentUser(currentUser);
          } catch (errors) {
            setFormError(errors);
            setCurrentUser(null);
          }
        }
        setInfoLoaded(true);
      }
      setInfoLoaded(false);
      getCurrentUser();
    },
    [token, setCurrentUser]
  );

  useEffect(() => {
    async function getCalDataByUser() {
      const userCalData = await ComeAwayApi.getAllCals();
      if (currentUser)
        userCalData.forEach((d) => {
          try {
            if (currentUser.id === d.userId) {
              setCalUserId(d.userId);
            }
          } catch (errors) {
            return null;
          }
        });
    }

    getCalDataByUser();
  }, [currentUser]);

  const loggedOutUser = () => {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item mr-4">
          <a className="nav-link" href="/login">
            Login
          </a>
        </li>
        <li className="nav-item mr-4">
          <a className="nav-link" href="/signup">
            Sign Up
          </a>
        </li>
      </ul>
    );
  };

  const loggedInUser = () => {
    if (currentUser.id !== calUserId) {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-4">
            <a
              className="nav-link"
              href={`/${currentUser.username}/calendar/setup/1`}
            >
              Create Calendar
            </a>
          </li>
          <li className="nav-item mr-4">
            <a
              className="nav-link"
              href={`/${currentUser.username}/profile/edit`}
            >
              Profile
            </a>
          </li>
          <li className="nav-item mr-4">
            <a className="nav-link" href="/" onClick={logout}>
              Logout
            </a>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-4">
            <a
              className="nav-link"
              href={`/${currentUser.username}/calendar/edit`}
            >
              Edit Calendar
            </a>
          </li>
          <li className="nav-item mr-4">
            <a
              className="nav-link"
              href={`/${currentUser.username}/profile/edit`}
            >
              Profile
            </a>
          </li>
          <li className="nav-item mr-4">
            <a className="nav-link" href="/" onClick={logout}>
              Logout
            </a>
          </li>
        </ul>
      );
    }
  };

  return (
    <nav className="NavBar navbar navbar-expand-sm">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          COME/AWAY
        </a>
        {currentUser ? loggedInUser() : loggedOutUser()}
      </div>
    </nav>
  );
};

export default NavBar;

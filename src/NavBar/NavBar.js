import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import UserContext from "../Auth/UserContext";
import ComeAwayApi from "../api/api";
import useLocalStorage from "../hooks/useLocalStorage";
import jwt from "jsonwebtoken";

export const TOKEN_STORAGE_ID = "comeaway-token";

const NavBar = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, logout } = useContext(UserContext);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [calUserId, setCalUserId] = useState([]);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [formError, setFormError] = useState([]);

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
    [token]
  );

  useEffect(() => {
    async function getCalDataByUser() {
      const userCalData = await ComeAwayApi.getCalData();
      try {
        if (currentUser)
          userCalData.map((d) => {
            if (currentUser.id === d.userId) setCalUserId(d.userId);
          });
      } catch (errors) {
        return;
      }
    }
    getCalDataByUser();
  }, []);

  const loggedInUser = () => {
    if (currentUser.id === calUserId) {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-4">
            <NavLink
              className="nav-link"
              to={`/calendar/${currentUser.username}/edit`}
            >
              Edit Calendar
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink
              className="nav-link"
              to={`/profile/${currentUser.username}/edit`}
            >
              Profile
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink className="nav-link" onClick={logout}>
              Logout
            </NavLink>
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-4">
            <NavLink
              className="nav-link"
              to={`/calendar/${currentUser.username}/create`}
            >
              Create Calendar
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink
              className="nav-link"
              to={`/profile/${currentUser.username}/edit`}
            >
              Profile
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/" onClick={logout}>
              Logout
            </NavLink>
          </li>
        </ul>
      );
    }
  };

  const loggedOutUser = () => {
    return (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/login">
            Login
          </NavLink>
        </li>
        <li className="nav-item mr-4">
          <NavLink className="nav-link" to="/signup">
            Sign Up
          </NavLink>
        </li>
      </ul>
    );
  };

  return (
    <nav className="NavBar navbar navbar-expand-sm">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          COME/AWAY
        </Link>
        {currentUser ? loggedInUser() : loggedOutUser()}
      </div>
    </nav>
  );
};

export default NavBar;

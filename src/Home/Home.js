import { useState, useEffect, useContext } from "react";
import UserContext from "../Auth/UserContext";
import useLocalStorage from "../hooks/useLocalStorage";
import { Link, useNavigate } from "react-router-dom";
import jwt from "jsonwebtoken";
import Calendar from "../Calendar/Calendar";
import ComeAwayApi from "../api/api";

export const TOKEN_STORAGE_ID = "comeaway-token";

const Home = () => {
  const navigate = useNavigate();
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [calUserId, setCalUserId] = useState();
  const [formError, setFormError] = useState([]);

  const { currentUser, setCurrentUser } = useContext(UserContext);
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

  const loggedOutUser = () => {
    return (
      <div>
        <p>
          Finally, a scheduler for expecting parents. No more trying to
          facilitate visiting while dealing with the stressors of your new
          child! Let us take care of that for you.
        </p>
        <p>
          <Link className="btn btn-primary" to="/login">
            Login
          </Link>
          <Link className="btn btn-primary ms-3" to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    );
  };

  const loggedInUser = () => {
    if (currentUser.id !== calUserId) {
      return (
        <div>
          <h2>
            Welcome Back, {currentUser.firstName || currentUser.username}!
          </h2>
          <p>Lets get started with created a calendar</p>
          <Link
            className="btn btn-primary"
            to={`/calendar/${currentUser.username}/create`}
          >
            Create Calendar
          </Link>
        </div>
      );
    } else {
      return (
        <div>
          <h2>
            Welcome Back, {currentUser.firstName || currentUser.username}!
          </h2>
          <Calendar />
        </div>
      );
    }
  };

  return (
    <div className="Home">
      <div className="container text-center">
        <h1>COME/AWAY</h1>
        {currentUser ? loggedInUser() : loggedOutUser()}
      </div>
    </div>
  );
};

export default Home;

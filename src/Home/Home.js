import { useState, useEffect, useContext } from "react";
import UserContext from "../Auth/UserContext.js";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { Link } from "react-router-dom";
import jwt from "jsonwebtoken";
import Calendar from "../Calendar/Calendar.js";
import { ComeAwayApi } from "../api/api.js";

export const TOKEN_STORAGE_ID = "comeaway-token";

const Home = () => {
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
    [token, setCurrentUser]
  );

  useEffect(() => {
    async function getCalDataByUser() {
      const userCalData = await ComeAwayApi.getAllCals();
      if (currentUser)
        userCalData.forEach((d) => {
          try {
            if (currentUser.id === d.userId) setCalUserId(d.userId);
          } catch (errors) {
            return null;
          }
        });
    }
    getCalDataByUser();
  }, [currentUser]);

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
          <p>Lets get started with creating your visiting calendar!</p>
          <Link
            className="btn btn-primary"
            to={`/${currentUser.username}/calendar/setup/1`}
          >
            Create Calendar
          </Link>
        </div>
      );
    } else {
      return (
        <div>
          <div className="m-5">
            <h4>
              Share this link with family and friends so they can schedule a
              visit to meet your families newest edition!
            </h4>
            <h6 className="mb-3">
              <a href={`/${currentUser.username}/calendar/visit`}>
                https://comeaway.surge.sh/{currentUser.username}/calendar/visit
              </a>
            </h6>
          </div>

          <Calendar />
        </div>
      );
    }
  };

  return (
    <div className="Home m-5">
      <div className="container text-center">
        <h1 className="mb-4">COME/AWAY</h1>
        {currentUser ? loggedInUser() : loggedOutUser()}
      </div>
    </div>
  );
};

export default Home;

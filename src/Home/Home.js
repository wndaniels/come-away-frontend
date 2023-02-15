import { useContext } from "react";
import UserContext from "../Auth/UserContext";
import { Link } from "react-router-dom";
import Calendar from "../Calendar/Calendar";

const Home = () => {
  const { currentUser } = useContext(UserContext);

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
    if (!currentUser.calendarId)
      return (
        <div>
          <h2>
            Welcome Back, {currentUser.firstName || currentUser.username}!
          </h2>
          <p>
            <Link className="btn btn-primary" to="/calendar/create">
              Create Calendar
            </Link>
          </p>
        </div>
      );

    if (currentUser.calendarId)
      return (
        <div>
          <div>
            <h2>
              Welcome Back, {currentUser.firstName || currentUser.username}!
            </h2>
          </div>
          <div>
            <Calendar />
          </div>
        </div>
      );
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

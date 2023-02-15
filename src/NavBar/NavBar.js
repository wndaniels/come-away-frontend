import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import UserContext from "../Auth/UserContext";

const NavBar = () => {
  const { currentUser, logout } = useContext(UserContext);

  const loggedInUser = () => {
    if (!currentUser.calendarId)
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/calendar/create">
              Create Calendar
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/:username/profile/edit">
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
    if (currentUser.calendarId)
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item mr-4">
            <NavLink className="nav-link" to="/calendar/edit">
              Edit Calendar
            </NavLink>
          </li>
          <li className="nav-item mr-4">
            <NavLink
              className="nav-link"
              to={`/${currentUser.username}/profile/edit`}
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

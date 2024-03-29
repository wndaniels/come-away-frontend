import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import UserContext from "../Auth/UserContext.js";

const PrivateRoute = () => {
  const { currentUser } = useContext(UserContext);

  return currentUser ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;

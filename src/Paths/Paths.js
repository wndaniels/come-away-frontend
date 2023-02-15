import {
  Route,
  Navigate,
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
} from "react-router-dom";

import Home from "../Home/Home";
import PrivatePaths from "./PrivatePaths";
import Main from "../Main";
import LoginForm from "../Auth/LoginForm";
import SignUpForm from "../Auth/SignUpForm";
import ProfileEditForm from "../Profile/ProfileEditForm";
import Calendar from "../Calendar/Calendar";
import CalendarForm from "../Calendar/CalendarForm";
import CalendarEditForm from "../Calendar/CalendarEditForm";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Main />}>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/login" element={<LoginForm />} />
      <Route exact path="/signup" element={<SignUpForm />} />
      <Route element={<PrivatePaths />}>
        <Route
          exact
          path="/:username/profile/edit"
          element={<ProfileEditForm />}
        />
        <Route exact path="/calendar/create" element={<CalendarForm />} />
        <Route exact path="/calendar" element={<Calendar />} />
        <Route exact path="/calendar/edit" element={<CalendarEditForm />} />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Route>
  )
);

const Paths = () => {
  return <RouterProvider router={router} />;
};

export default Paths;

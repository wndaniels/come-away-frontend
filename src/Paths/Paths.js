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
import VisitorForm from "../Visitor/VisitorForm";
import DueDateForm from "../DueDate/DueDateForm";
import DueDateEditForm from "../DueDate/DueDateEditForm";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Main />}>
      <Route exact path="/" element={<Home />} />
      <Route exact path="/login" element={<LoginForm />} />
      <Route exact path="/signup" element={<SignUpForm />} />
      <Route exact path="/calendar/:username/visit" element={<VisitorForm />} />
      <Route element={<PrivatePaths />}>
        <Route
          exact
          path="/:username/calendar/setup/1"
          element={<DueDateForm />}
        />
        <Route
          exact
          path="/:username/calendar/setup/2"
          element={<CalendarForm />}
        />
        <Route
          exact
          path="/:username/due-date/edit"
          element={<DueDateEditForm />}
        />
        <Route
          exact
          path="/:username/profile/edit"
          element={<ProfileEditForm />}
        />
        <Route exact path="/:username/calendar" element={<Calendar />} />
        <Route
          exact
          path="/:username/calendar/edit"
          element={<CalendarEditForm />}
        />

        <Route exact path="/:username/calendar/delete" />
      </Route>
      <Route path="*" element={<Navigate replace to="/" />} />
    </Route>
  )
);

const Paths = () => {
  return <RouterProvider router={router} />;
};

export default Paths;

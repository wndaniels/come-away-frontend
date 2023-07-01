import LoginForm from "../Auth/LoginForm.js";
import SignUpForm from "../Auth/SignUpForm.js";
import Calendar from "../Calendar/Calendar.js";
import CalendarForm from "../Calendar/CalendarForm.js";
import CalendarEditForm from "../Calendar/CalendarEditForm.js";
import DueDateEditForm from "../DueDate/DueDateEditForm.js";
import DueDateForm from "../DueDate/DueDateForm.js";
import Home from "../Home/Home.js";
import Main from "../Main.js";
import ProfileEditForm from "../Profile/ProfileEditForm.js";
import VistorConfirmation from "../Visitor/VisitorConfirmation.js";
import VisitorForm from "../Visitor/VisitorForm.js";
import PrivateRoute from "./PrivateRoute.js";
import { Navigate } from "react-router-dom";

const routerConfig = [
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <LoginForm />,
      },
      {
        path: "/signup",
        element: <SignUpForm />,
      },
      {
        path: "/:username/calendar/visit",
        element: <VisitorForm />,
      },
      {
        path: "/thankyou",
        element: <VistorConfirmation />,
      },
      {
        element: <PrivateRoute />,
        children: [
          {
            path: "/:username/calendar/setup/1",
            element: <DueDateForm />,
          },
          {
            path: "/:username/calendar/setup/2",
            element: <CalendarForm />,
          },
          {
            path: "/:username/due-date/edit",
            element: <DueDateEditForm />,
          },
          {
            path: "/:username/profile/edit",
            element: <ProfileEditForm />,
          },
          {
            path: "/:username/calendar",
            element: <Calendar />,
          },
          {
            path: "/:username/calendar/edit",
            element: <CalendarEditForm />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate replace to="/" />,
      },
    ],
  },
];

export default routerConfig;

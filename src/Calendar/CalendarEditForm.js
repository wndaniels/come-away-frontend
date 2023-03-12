import React, { useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Form, Link, useNavigate } from "react-router-dom";
import ComeAwayApi from "../api/api";
import UserContext from "../Auth/UserContext";
import jwt from "jsonwebtoken";
import Alert from "../Common/Alert";

export const TOKEN_STORAGE_ID = "comeaway-token";

const CalendarForm = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [calViews, setCalViews] = useState([]);
  const [calAvailBegin, setCalAvailBegin] = useState([]);
  const [calAvailEnd, setCalAvailEnd] = useState([]);
  const [calByUser, setCalByUser] = useState([]);
  const [formData, setFormData] = useState({
    viewType: calByUser.viewType,
    businessBeginsHour: calByUser.businessBeginsHour,
    businessEndsHour: calByUser.businessEndsHour,
  });

  const [calendar, setCalendar] = useState();
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
        userCalData.map((d) => {
          if (currentUser.id === d.userId) setCalByUser(d);
        });
      } catch (errors) {
        return;
      }
    }
    getCalDataByUser([]);
  }, []);

  useEffect(function getCalData() {
    async function getViewData() {
      try {
        const viewRes = await ComeAwayApi.getCalViews();
        setCalViews(viewRes);
      } catch (errors) {
        return;
      }
    }

    async function getBeginHoursData() {
      try {
        const beginHourRes = await ComeAwayApi.getBeginHours();
        setCalAvailBegin(beginHourRes);
      } catch (errors) {
        return;
      }
    }

    async function getEndHourData() {
      try {
        const endHourRes = await ComeAwayApi.getEndtHours();
        setCalAvailEnd(endHourRes);
      } catch (errors) {
        return;
      }
    }

    getViewData([]);
    getBeginHoursData([]);
    getEndHourData([]);
  }, []);

  async function handleSubmit(evt) {
    evt.preventDefault();

    let calendarData = {
      viewType: formData.viewType,
      businessBeginsHour: formData.businessBeginsHour,
      businessEndsHour: formData.businessEndsHour,
    };

    let username = currentUser.username;

    let updatedCal;

    try {
      updatedCal = await ComeAwayApi.updateCal(username, calendarData);
    } catch (errors) {
      setFormError([errors]);
      return;
    }
    navigate("/calendar");
    setFormData((f) => ({ ...f }));
    setFormError([]);
  }

  function handleViewChange(evt) {
    const { name, value } = evt.target;

    setFormData((f) => ({
      ...f,
      [name]: value,
    }));

    setFormError([]);
  }

  function handleHourChange(evt) {
    const { name, value } = evt.target;

    setFormData((f) => ({
      ...f,
      [name]: parseInt(value),
    }));

    setFormError([]);
  }

  async function handleDelete(evt) {
    let username = currentUser.username;
    let id = calByUser.id;

    try {
      await ComeAwayApi.deleteCal(username, id);
    } catch (errors) {
      return;
    }
    navigate("/");
  }

  if (!infoLoaded) return;

  return (
    <div className="CalendarForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h1 className="mb-3">Edit Calendar</h1>
        <div className="card">
          <div className="card-body">
            <Form method="patch">
              <div className="d-grid gap-3">
                <div className="form-group">
                  {formError.length ? (
                    <Alert
                      type="danger"
                      messages={["All fields must be complete."]}
                    ></Alert>
                  ) : null}
                  <label htmlFor="viewType">* Select Calendar View:</label>
                  <select
                    name="viewType"
                    className="form-control"
                    onChange={handleViewChange}
                  >
                    <option hidden>-</option>
                    {calViews &&
                      calViews.map((v, id) => (
                        <option value={v.viewType} key={id}>
                          {v.viewType}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="businessBeginsHour">
                    * Select Start Time:
                  </label>
                  <select
                    name="businessBeginsHour"
                    className="form-control"
                    onChange={handleHourChange}
                  >
                    <option hidden>-</option>
                    {calAvailBegin &&
                      calAvailBegin.map((s, id) => (
                        <option value={s.businessBeginsHour} key={id}>
                          {s.hourTitle}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="businessEndsHour">* Select End Time:</label>
                  <select
                    name="businessEndsHour"
                    className="form-control mb-3"
                    onChange={handleHourChange}
                  >
                    <option hidden>-</option>
                    {calAvailEnd &&
                      calAvailEnd.map((e, id) => (
                        <option value={e.businessEndsHour} key={id}>
                          {e.hourTitle}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="btn btn-sm btn-primary mr-3"
              >
                Update Calendar
              </button>
              <button onClick={handleDelete} className="btn btn-sm btn-danger">
                Delete
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarForm;

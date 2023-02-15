import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useLocalStorage from "../hooks/useLocalStorage";
import { Form, Navigate, Route } from "react-router-dom";
import ComeAwayApi from "../api/api";
import UserContext from "../Auth/UserContext";
import jwt from "jsonwebtoken";

export const TOKEN_STORAGE_ID = "comeaway-token";

const CalendarForm = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [calViews, setCalViews] = useState([]);
  const [availStart, setAvailStart] = useState();
  const [availEnd, setAvailEnd] = useState();
  const [formData, setFormData] = useState();
  const [calendar, setCalendar] = useState();

  useEffect(
    function loadUserInfo() {
      async function getCurrentUser() {
        if (token) {
          try {
            let { username } = jwt.decode(token);
            ComeAwayApi.token = token;
            let currentUser = await ComeAwayApi.getCurrentUser(username);
            setCurrentUser(currentUser);
          } catch (e) {
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

  useEffect(function getCalData() {
    async function getViewData(viewType) {
      const viewRes = await ComeAwayApi.getCalViews(viewType);
      setCalViews(viewRes);
    }

    async function getHourData(hour) {
      const hourRes = await ComeAwayApi.getHours(hour);
      setAvailStart(hourRes);
      setAvailEnd(hourRes);
    }
    getViewData();
    getHourData();
  }, []);

  async function handleSubmit(evt) {
    evt.preventDefault();

    let calendarData = {
      calViewId: formData.calViews.id,
      availStartId: formData.availStart.id,
      availEndId: formData.availEnd.id,
    };

    let createdCal;

    try {
      createdCal = await ComeAwayApi.createCal(calendarData);
    } catch (errors) {
      return;
    }
    setFormData((f) => ({ ...f }));
    setCalendar(createdCal);
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setFormData((f) => ({
      ...f,
      [name]: value,
    }));
    // setFormError([]);
  }

  if (!infoLoaded) return;

  if (!currentUser.calendar_id)
    return (
      <div className="CalendarForm">
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
          <h1 className="mb-3">Create Calendar</h1>
          <div className="card">
            <div className="card-body">
              <Form method="post">
                <div className="d-grid gap-3">
                  <div className="form-group">
                    <label htmlFor="calView">Select Calendar View:</label>
                    <select
                      name="calView"
                      className="form-control"
                      onChange={handleChange}
                    >
                      {calViews &&
                        calViews.map((v, id) => (
                          <option key={id}>{v.viewType}</option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="availStart">Select Start Time:</label>
                    <select
                      name="availStart"
                      className="form-control"
                      onChange={handleChange}
                    >
                      {availStart &&
                        availStart.map((s, id) => (
                          <option key={id}>{s.hour}</option>
                        ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="availEnd">Select End Time:</label>
                    <select
                      name="availEnd"
                      className="form-control"
                      onChange={handleChange}
                    >
                      {availEnd &&
                        availEnd.map((e, id) => (
                          <option key={id}>{e.hour}</option>
                        ))}
                    </select>
                  </div>
                </div>
                <button className="btn btn-sm btn-primary mt-3">
                  Create Calendar
                </button>
              </Form>
            </div>
          </div>
        </div>
      </div>
    );
};

export default CalendarForm;

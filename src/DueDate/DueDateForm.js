import React, { useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Form, useNavigate } from "react-router-dom";
import ComeAwayApi from "../api/api";
import UserContext from "../Auth/UserContext";
import jwt from "jsonwebtoken";
import Alert from "../Common/Alert";
import CalendarForm from "../Calendar/CalendarForm";

export const TOKEN_STORAGE_ID = "comeaway-token";

const DueDateForm = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [days, setDays] = useState([]);
  const [months, setMonths] = useState([]);
  const [years, setYears] = useState();
  const [formData, setFormData] = useState({
    babyName: "",
    yearId: 0,
    monthId: 0,
    dayId: 0,
    userId: currentUser.id,
  });
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

  useEffect(function getDateData() {
    async function getDaysData() {
      const dayRes = await ComeAwayApi.getDays();
      setDays(dayRes);
    }

    async function getMonthsData() {
      const monthRes = await ComeAwayApi.getMonths();
      setMonths(monthRes);
    }

    async function getYearsData() {
      const yearRes = await ComeAwayApi.getYears();
      setYears(yearRes);
    }

    getDaysData([]);
    getMonthsData([]);
    getYearsData([]);
  }, []);

  async function handleSubmit(evt) {
    evt.preventDefault();

    let dueDateData = {
      babyName: formData.babyName,
      yearId: formData.yearId,
      monthId: formData.monthId,
      dayId: formData.dayId,
      userId: currentUser.id,
    };

    let username = currentUser.username;

    let createdDueDate;

    try {
      createdDueDate = await ComeAwayApi.createDueDate(username, dueDateData);
    } catch (errors) {
      setFormError([errors]);
      return;
    }

    setFormData((f) => ({ ...f }));
    setFormError([]);
    navigate(`/${currentUser.username}/calendar/setup/2`);
  }

  function handleChange(evt) {
    const { name, value } = evt.target;

    setFormData((f) => ({
      ...f,
      [name]: value,
    }));

    setFormError([]);
  }

  function handleIntChange(evt) {
    const { name, value } = evt.target;

    setFormData((f) => ({
      ...f,
      [name]: parseInt(value),
    }));

    setFormError([]);
  }

  if (!infoLoaded) return;

  return (
    <div className="DueDateForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <div className="card">
          <div className="card-body">
            <Form method="post">
              <div className="d-grid gap-3">
                <div className="form-group">
                  <h1>Tell us about baby!</h1>

                  <div className="form-group">
                    <label htmlFor="babyName">
                      Do you have a name picked out yet?
                      <i> (Dont worry, you can edit this later.)</i>
                    </label>
                    <input
                      name="babyName"
                      type="text"
                      className="form-control mb-3"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="monthId">Month</label>
                    <select
                      name="monthId"
                      className="form-control"
                      onChange={handleIntChange}
                    >
                      <option hidden>Month</option>
                      {months &&
                        months.map((m, id) => (
                          <option value={m.id} key={id}>
                            {m.month}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dayId">Day</label>
                    <select
                      name="dayId"
                      className="form-control"
                      onChange={handleIntChange}
                    >
                      <option hidden>Day</option>
                      {days &&
                        days.map((d, id) => (
                          <option value={d.id} key={id}>
                            {d.day}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="yearId">Year</label>
                    <select
                      name="yearId"
                      className="form-control"
                      onChange={handleIntChange}
                    >
                      <option hidden>Year</option>
                      {years &&
                        years.map((y, id) => (
                          <option value={y.id} key={id}>
                            {y.year}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <button onClick={handleSubmit} className="btn btn-sm btn-primary">
                Next
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DueDateForm;

import React, { useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";
import { useNavigate } from "react-router-dom";
import ComeAwayApi from "../Api/api.js";
import UserContext from "../Auth/UserContext.js";
import jwt from "jsonwebtoken";
import Alert from "../Common/Alert.js";
import DueDateEditForm from "../DueDate/DueDateEditForm.js";

export const TOKEN_STORAGE_ID = "comeaway-token";

const CalendarEditForm = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [calAvailBegin, setCalAvailBegin] = useState([]);
  const [calAvailEnd, setCalAvailEnd] = useState([]);
  const [calByUser, setCalByUser] = useState([]);
  const [dueDateByUser, setDueDateByUser] = useState();
  const [formData, setFormData] = useState({
    businessBeginsHour: calByUser.businessBeginsHour,
    businessEndsHour: calByUser.businessEndsHour,
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
    [token, setCurrentUser]
  );

  useEffect(() => {
    async function getCalDataByUser() {
      const userCalData = await ComeAwayApi.getAllCals();
      try {
        userCalData.forEach((d) => {
          if (currentUser?.id === d.userId) setCalByUser(d);
        });
      } catch (errors) {
        return;
      }
    }
    getCalDataByUser([]);
  }, [currentUser?.id]);

  useEffect(() => {
    async function getDueDateByUser() {
      const dueDateData = await ComeAwayApi.getAllDueDates();

      try {
        dueDateData.forEach((d) => {
          if (currentUser?.id === d.userId) setDueDateByUser(d);
        });
      } catch (errors) {
        return;
      }
    }
    getDueDateByUser();
  }, [currentUser?.id]);

  useEffect(function getCalData() {
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
        const endHourRes = await ComeAwayApi.getEndHours();
        setCalAvailEnd(endHourRes);
      } catch (errors) {
        return;
      }
    }

    getBeginHoursData([]);
    getEndHourData([]);
  }, []);

  async function handleCalSubmit(evt) {
    evt.preventDefault();

    let calendarData = {
      businessBeginsHour: formData.businessBeginsHour,
      businessEndsHour: formData.businessEndsHour,
    };

    let username = currentUser.username;
    let id = calByUser.id;

    let updatedCal;

    try {
      updatedCal = await ComeAwayApi.updateCal(username, id, calendarData);
    } catch (errors) {
      setFormError([errors]);
      return;
    }
    navigate("/calendar");
    setFormData((f) => ({ ...f }));
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

  async function handleDeleteCal(evt) {
    let username = currentUser.username;
    let id = calByUser.id;

    try {
      await ComeAwayApi.deleteCal(username, id);
    } catch (errors) {
      return;
    }
    navigate("/");
  }

  async function handleDeleteDueDate(evt) {
    let username = currentUser.username;
    let id = dueDateByUser.id;

    try {
      await ComeAwayApi.deleteDueDate(username, id);
    } catch (errors) {
      return;
    }
    navigate("/");
  }

  if (!infoLoaded) return;

  return (
    <div className="m-5">
      <div>
        <DueDateEditForm />
      </div>
      <div className="CalendarEditForm mt-5">
        <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
          <h1 className="mb-3">Edit Calendar</h1>
          <div className="card">
            <div className="card-body">
              <form method="patch">
                <div className="d-grid gap-3">
                  {formError.length ? (
                    <Alert
                      type="danger"
                      messages={["All fields must be complete."]}
                    ></Alert>
                  ) : null}

                  <div className="form-group">
                    <label htmlFor="businessBeginsHour">
                      * Select Start Time:
                    </label>
                    <select
                      name="businessBeginsHour"
                      className="form-control"
                      onChange={handleIntChange}
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
                      onChange={handleIntChange}
                    >
                      <option hidden>-</option>
                      {calAvailEnd &&
                        calAvailEnd.map((e, id) => (
                          <option
                            defaultValue={e}
                            value={e.businessEndsHour}
                            key={id}
                          >
                            {e.hourTitle}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleCalSubmit}
                  className="btn btn-sm btn-primary "
                >
                  Update Calendar
                </button>
                <button
                  onClick={() => {
                    handleDeleteCal();
                    handleDeleteDueDate();
                  }}
                  className="btn btn-sm btn-danger ms-3"
                >
                  Delete
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarEditForm;

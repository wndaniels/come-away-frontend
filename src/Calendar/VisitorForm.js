import React, { useContext, useEffect, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { Form, useNavigate, useParams } from "react-router-dom";
import ComeAwayApi from "../api/api";
import UserContext from "../Auth/UserContext";
import jwt from "jsonwebtoken";
import Alert from "../Common/Alert";

// export const TOKEN_STORAGE_ID = "comeaway-token";

const VisitorForm = () => {
  const navigate = useNavigate();
  // const { currentUser, setCurrentUser } = useContext(UserContext);
  const [infoLoaded, setInfoLoaded] = useState(false);
  // const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [paramUserId, setParamUserId] = useState([]);
  const [calId, setCalId] = useState([]);
  const [calAvailBegin, setCalAvailBegin] = useState([]);
  const [calAvailEnd, setCalAvailEnd] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    note: "",
    startTime: 0,
    endTime: 0,
    calendarId: calId.id,
  });

  const [visit, setVisit] = useState();
  const [formError, setFormError] = useState([]);

  const params = useParams();

  useEffect(
    function loadUsersInfo() {
      async function getUsers() {
        const userData = await ComeAwayApi.getAllUsers();
        try {
          userData.map((d) => {
            if (params.username === d.username) setParamUserId(d);
          });
        } catch (errors) {
          return;
        }
        setInfoLoaded(true);
      }
      setInfoLoaded(false);
      getUsers([]);
    },
    [params.username]
  );

  useEffect(() => {
    async function getCalIdByUser() {
      const calData = await ComeAwayApi.getCalData();
      try {
        calData.map((i) => {
          if (paramUserId.id === i.userId) setCalId(i);
        });
      } catch (errors) {
        return;
      }
    }
    getCalIdByUser([]);
  }, [paramUserId]);

  useEffect(function getCalData() {
    async function getBeginHoursData() {
      const beginHourRes = await ComeAwayApi.getBeginHours();
      setCalAvailBegin(beginHourRes);
    }

    async function getEndHourData() {
      const endHourRes = await ComeAwayApi.getEndtHours();
      setCalAvailEnd(endHourRes);
    }

    getBeginHoursData([]);
    getEndHourData([]);
  }, []);

  async function handleSubmit(evt) {
    evt.preventDefault();

    let visitData = {
      fullName: formData.fullName,
      note: formData.note,
      startTime: formData.startTime,
      endTime: formData.endTime,
      calendarId: calId.id,
    };

    let createdVisit;

    try {
      createdVisit = await ComeAwayApi.addVisit(visitData);
      console.log(createdVisit);
    } catch (errors) {
      setFormError([errors]);
      return;
    }
    // navigate("/calendar");
    setFormData((f) => ({ ...f }));
    setFormError([]);
    setVisit(createdVisit);
  }

  function handleChange(evt) {
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

  if (!infoLoaded) return <h3>Loading...</h3>;

  return (
    <div className="CalendarForm">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h1 className="mb-3">Schedule a Visit!</h1>
        <div className="card">
          <div className="card-body">
            <Form method="patch" onSubmit={handleSubmit}>
              <div className="d-grid gap-3">
                <div className="form-group">
                  {formError.length ? (
                    <Alert
                      type="danger"
                      messages={["All fields must be complete."]}
                    ></Alert>
                  ) : null}
                  <div className="form-group">
                    <label htmlFor="fullName">* Name of Visitor(s):</label>
                    <input
                      name="fullName"
                      type="text"
                      onChange={handleChange}
                      className="form-control mb-3"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="note">Leave a note for the family:</label>
                    <textarea
                      name="note"
                      type="text"
                      onChange={handleChange}
                      className="form-control mb-3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="startTime">
                      * What time would you like to visit?:
                    </label>
                    <select
                      name="startTime"
                      className="form-control mb-3"
                      onChange={handleHourChange}
                    >
                      {calAvailBegin &&
                        calAvailBegin.map((s, id) => (
                          <option value={s.businessBeginsHour} key={id}>
                            {s.hourTitle}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">
                      * Select an end time for your visit.
                      <i> (Please try to limit visits to 1 hour)</i>:
                    </label>
                    <select
                      name="endTime"
                      className="form-control mb-3"
                      onChange={handleHourChange}
                    >
                      {calAvailEnd &&
                        calAvailEnd.map((e, id) => (
                          <option value={e.businessEndsHour} key={id}>
                            {e.hourTitle}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              <button className="btn btn-sm btn-primary">
                Update Calendar
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorForm;

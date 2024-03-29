import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ComeAwayApi } from "../api/api";
import Alert from "../Common/Alert";
import moment from "moment";

const VisitorForm = () => {
  const navigate = useNavigate();
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [paramUser, setParamUser] = useState([]);
  const [calId, setCalId] = useState([]);
  const [calAvailBegin, setCalAvailBegin] = useState([]);
  const [calAvailEnd, setCalAvailEnd] = useState([]);
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [dueDate, setDueDate] = useState();
  const [startDateFromDueDate, setStartDateFromDueDate] = useState();
  const [visit, setVisit] = useState();
  const [dateIsoValue, setDateIsoValue] = useState();
  const [timeStartIsoValue, setTimeStartIsoValue] = useState();
  const [timeEndIsoValue, setTimeEndIsoValue] = useState();
  const [formError, setFormError] = useState([]);
  const [formData, setFormData] = useState({
    fullName: "",
    note: "",
    startTime: "",
    endTime: "",
    calendarId: calId.id,
  });

  const params = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        setInfoLoaded(false);
        const calData = await ComeAwayApi.getAllCals();
        const userData = await ComeAwayApi.getAllUsers();

        if (userData) {
          const paramUserData = userData.find(
            (d) => params.username === d.username
          );
          setParamUser(paramUserData);

          if (paramUserData && calData) {
            const calDataForUser = calData.find(
              (i) => paramUserData.id === i.userId
            );
            setCalId(calDataForUser);
          }
        }

        const beginHourRes = await ComeAwayApi.getBeginHours();
        if (beginHourRes) {
          setCalAvailBegin(beginHourRes);
        }

        const endHourRes = await ComeAwayApi.getEndHours();
        if (endHourRes) {
          setCalAvailEnd(endHourRes);
        }

        setInfoLoaded(true);
      } catch (errors) {
        console.error(errors);
      }
    }

    fetchData();
  }, [params.username]);

  useEffect(() => {
    async function fetchYearMonthDayData() {
      if (dueDate) {
        const yearData = await ComeAwayApi.getYears();
        const yearDataForUser = yearData.find((y) => dueDate.yearId === y.id);
        if (yearDataForUser) {
          setYear(yearDataForUser.year);
        }

        const monthData = await ComeAwayApi.getMonths();

        const monthDataForUser = monthData.find(
          (m) => dueDate.monthId === m.id
        );
        if (monthDataForUser) {
          setMonth(monthDataForUser.id);
        }

        const dayData = await ComeAwayApi.getDays();

        const dayDataForUser = dayData.find((d) => dueDate.dayId === d.id);
        if (dayDataForUser) {
          setDay(dayDataForUser.id);
        }
      }
    }

    if (dueDate) {
      fetchYearMonthDayData();
    }
  }, [dueDate]);

  useEffect(() => {
    async function fetchDueDateData() {
      const dueDateResponse = await ComeAwayApi.getAllDueDates();
      const dueDateData = dueDateResponse.find(
        (d) => paramUser.id === d.userId
      );
      if (dueDateData) {
        setDueDate(dueDateData);
      }
    }
    if (paramUser && paramUser.id) {
      fetchDueDateData();
    }
  }, [paramUser]);

  useEffect(() => {
    try {
      if (year && month && day) {
        let date = new Date(year + "-" + month + "-" + day).toISOString();
        setStartDateFromDueDate(date);
      }
    } catch (errors) {
      console.error(errors);
    }
  }, [year, month, day]);

  let timeOptions = [];

  const startTimeKey = calId.businessBeginsHour;
  const endTimeKey = calId.businessEndsHour;

  for (let i = startTimeKey; i <= endTimeKey; i++) {
    if (calAvailBegin[i]) {
      const timeValue = calAvailBegin[i];
      timeOptions.push(
        <option key={i} value={timeValue.isoTime}>
          {timeValue.hourTitle}
        </option>
      );
    }
  }

  const dateObj = moment(startDateFromDueDate, "YYYY-MM-DDTHH:mm:ss");
  let visitDayOption = [];

  for (let i = 0; i < 7; i++) {
    if (dateObj) {
      const nextDate = dateObj.clone().add(i, "days");
      visitDayOption.push(
        <option key={i} value={nextDate.format("YYYY-MM-DD")}>
          {nextDate.format("MM-DD-YYYY")}
        </option>
      );
    }
  }

  async function handleSubmit(evt) {
    evt.preventDefault();

    const appendStartValues = dateIsoValue + "T" + timeStartIsoValue;
    const appendEndValues = dateIsoValue + "T" + timeEndIsoValue;

    let visitData = {
      fullName: formData.fullName,
      note: formData.note,
      visitDate: formData.visitDate,
      startTime: appendStartValues,
      endTime: appendEndValues,
      calendarId: calId.id,
    };

    let createdVisit;

    try {
      createdVisit = await ComeAwayApi.createVisit(visitData);
    } catch (errors) {
      setFormError([errors]);
      return;
    }
    navigate("/thankyou");
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

  if (!infoLoaded) return <h3>Loading...</h3>;

  return (
    <div className="VisitorForm m-5">
      <div className="container col-md-6 offset-md-3 col-lg-4 offset-lg-4">
        <h1 className="mb-3">Schedule a Visit!</h1>
        <div className="card">
          <div className="card-body">
            <form method="patch" onSubmit={handleSubmit}>
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
                      id="fullName"
                      name="fullName"
                      type="text"
                      onChange={handleChange}
                      className="form-control mb-3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="note">Leave a note for the family:</label>
                    <textarea
                      id="note"
                      name="note"
                      type="text"
                      onChange={handleChange}
                      className="form-control mb-3"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="visitDate">
                      * What day would you like to visit?:
                    </label>
                    <select
                      id="visitDate"
                      name="visitDate"
                      className="form-control mb-3"
                      onChange={(e) => setDateIsoValue(e.target.value)}
                    >
                      <option hidden>-</option>
                      {visitDayOption}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="startTime">
                      * What time would you like to visit?:
                    </label>
                    <select
                      id="startTime"
                      name="startTime"
                      className="form-control mb-3"
                      onChange={(e) => setTimeStartIsoValue(e.target.value)}
                    >
                      <option hidden>-</option>
                      {timeOptions}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="endTime">
                      * Select an end time for your visit:
                      <br />
                      <i>(Visits are limited to 1 hour increments)</i>
                    </label>
                    <select
                      id="endTime"
                      name="endTime"
                      className="form-control mb-3"
                      onChange={(e) => setTimeEndIsoValue(e.target.value)}
                    >
                      <option hidden>-</option>
                      {timeOptions}
                    </select>
                  </div>
                </div>
              </div>

              <button className="btn btn-sm btn-primary">
                Schedule your visit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorForm;

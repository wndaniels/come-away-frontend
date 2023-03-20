import React, { useEffect, useState } from "react";
import { Form, useNavigate, useParams } from "react-router-dom";
import ComeAwayApi from "../api/api";
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

  useEffect(
    function loadUsersInfo() {
      async function getUsers() {
        const userData = await ComeAwayApi.getAllUsers();
        try {
          userData.forEach((d) => {
            if (params.username === d.username) setParamUser(d);
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
      const calData = await ComeAwayApi.getAllCals();
      try {
        calData.forEach((i) => {
          if (paramUser.id === i.userId) setCalId(i);
        });
      } catch (errors) {
        return;
      }
    }
    getCalIdByUser([]);
  }, [paramUser]);

  useEffect(
    function getVisitingHoursData() {
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
    },
    [calId.businessBeginsHour]
  );

  useEffect(() => {
    async function getDueDate() {
      const dueDate = await ComeAwayApi.getAllDueDates();

      dueDate.forEach((d) => {
        if (paramUser.id === d.userId) {
          setDueDate(d);
        }
      });
    }

    getDueDate();
  }, [paramUser.id]);

  useEffect(
    function getDueDateData() {
      async function getDayData() {
        const dayData = await ComeAwayApi.getDays();

        dayData.forEach((d) => {
          if (dueDate?.dayId === d.id) {
            setDay(d.id);
          }
        });
      }

      async function getMonthData() {
        const monthData = await ComeAwayApi.getMonths();

        monthData.forEach((m) => {
          if (dueDate?.monthId === m.id) {
            setMonth(m.id);
          }
        });
      }

      async function getYearData() {
        const yearData = await ComeAwayApi.getYears();

        yearData.forEach((y) => {
          if (dueDate?.yearId === y.id) {
            setYear(y.year);
          }
        });
      }

      getDayData([]);
      getMonthData([]);
      getYearData([]);
    },
    [dueDate?.dayId, dueDate?.monthId, dueDate?.yearId]
  );

  useEffect(() => {
    async function createDueDateString() {
      try {
        let date = new Date(year + "-" + month + "-" + day).toISOString();
        setStartDateFromDueDate(date);
      } catch (errors) {
        return;
      }
    }
    createDueDateString();
  }, [year, month, day]);

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

  const startTimeKey = Math.min(calId.businessBeginsHour);
  const endTimeKey = Math.max(calId.businessEndsHour);

  let timeOptions = [];

  for (let i = startTimeKey; i <= endTimeKey; i++) {
    const timeValue = calAvailBegin[i];

    timeOptions.push(
      <option key={i} value={timeValue.isoTime}>
        {timeValue.hourTitle}
      </option>
    );
  }

  const dateStr = startDateFromDueDate;
  const dateObj = moment(dateStr, "YYYY-MM-DDTHH:mm:ss");
  let visitDayOption = [];

  for (let i = 0; i < 7; i++) {
    const nextDate = dateObj.clone().add(i, "days");
    visitDayOption.push(
      <option key={i} value={nextDate.format("YYYY-MM-DD")}>
        {nextDate.format("YYYY-MM-DD")}
      </option>
    );
  }

  if (!infoLoaded) return <h3>Loading...</h3>;

  return (
    <div className="VisitorForm m-5">
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
                    <label htmlFor="visitDate">
                      * What day would you like to visit?
                    </label>
                    <select
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
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorForm;

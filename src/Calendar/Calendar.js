import { useState, useRef, useEffect, useContext } from "react";
import UserContext from "../Auth/UserContext.js";
import useLocalStorage from "../hooks/useLocalStorage.js";
import jwt from "jsonwebtoken";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
import ComeAwayApi from "../Api/api";

const styles = {
  wrap: {
    display: "flex",
  },
  left: {
    marginRight: "10px",
  },
  main: {
    flexGrow: "1",
  },
};

export const TOKEN_STORAGE_ID = "comeaway-token";

const Calendar = () => {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [formError, setFormError] = useState([]);
  const [infoLoaded, setInfoLoaded] = useState(false);
  const calendarRef = useRef(null);
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const [dueDate, setDueDate] = useState();
  const [startDateFromDueDate, setStartDateFromDueDate] = useState();
  const [calViewData, setCalViewData] = useState();
  const [calAvailBegin, setCalAvailBegin] = useState();
  const [calAvailEnd, setCalAvailEnd] = useState();
  const [calUserId, setCalUserId] = useState();
  const [calByUserId, setCalByUserId] = useState();
  const [visitorData, setVisitorData] = useState();
  const [visitorDataForDisplay, setVisitorDataforDisplay] = useState([]);

  const [update, setUpdate] = useState([]);

  const [calData, setCalData] = useState({
    viewType: calViewData,
    businessBeginsHour: calAvailBegin,
    businessEndsHour: calAvailEnd,
  });

  useEffect(
    function loadUserInfo() {
      async function getCurrentUser() {
        try {
          let { username } = jwt.decode(token);
          ComeAwayApi.token = token;
          let currentUser = await ComeAwayApi.getCurrentUser(username);
          setCurrentUser(currentUser);
          setInfoLoaded(true);
        } catch (errors) {
          setFormError(errors);
          setCurrentUser(null);
        }
      }

      setInfoLoaded(false);

      if (token) {
        getCurrentUser();
      }
    },
    [token, setCurrentUser]
  );

  useEffect(() => {
    async function getDueDate() {
      const dueDate = await ComeAwayApi.getAllDueDates();

      dueDate.forEach((d) => {
        if (currentUser?.id === d.userId) {
          setDueDate(d);
        }
      });
    }

    getDueDate();
  }, [currentUser?.id]);

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
      let date;
      try {
        date = new Date(year + "-" + month + "-" + day).toISOString();
        setStartDateFromDueDate(date);
      } catch (errors) {
        return;
      }
    }
    createDueDateString();
  }, [year, month, day]);

  useEffect(() => {
    async function getCalDataByUser() {
      const userCalData = await ComeAwayApi.getAllCals();

      userCalData.forEach((d) => {
        if (currentUser.id === d.userId) {
          try {
            setCalByUserId(d);
            setCalViewData(d.viewType);
            setCalAvailBegin(d.businessBeginsHour);
            setCalAvailEnd(d.businessEndsHour);
            setCalUserId(d.userId);
          } catch (error) {
            return;
          }
        }
      });
    }

    async function getCalendarData() {
      let userCalendar;
      try {
        userCalendar = {
          viewType: calViewData,
          businessBeginsHour: calAvailBegin,
          businessEndsHour: calAvailEnd,
        };
      } catch (errors) {
        return;
      }

      setCalData(userCalendar);
    }

    getCalDataByUser([]);
    getCalendarData([]);
  }, [
    currentUser.id,
    calAvailBegin,
    calAvailEnd,
    calViewData,
    year,
    month,
    day,
  ]);

  useEffect(() => {
    async function getVisitorDataForDisplay() {
      const visitors = await ComeAwayApi.getAllVisitors();

      if (Array.isArray(visitors) && calByUserId?.id) {
        const matchingEvents = [];
        visitors.forEach((visitor) => {
          if (visitor.calendarId === calByUserId.id) {
            try {
              const event = {
                id: visitor.id,
                start: new DayPilot.Date(visitor.startTime),
                end: new DayPilot.Date(visitor.endTime),
                text: visitor.fullName,
              };
              matchingEvents.push(event);
            } catch (errors) {
              return;
            }
          }
        });
        if (matchingEvents.length > 0) {
          setVisitorDataforDisplay(matchingEvents);
        }
      }
    }

    async function getVisitorData() {
      const visitors = await ComeAwayApi.getAllVisitors();
      if (calByUserId?.id === visitors?.calendarId)
        try {
          visitors.forEach((v) => {
            setVisitorData(v);
          });
        } catch (errors) {
          return;
        }
    }

    getVisitorDataForDisplay();
    getVisitorData();
  }, [calByUserId?.id]);

  async function handleDeleteVisitors(args) {
    let username = currentUser.username;
    let id = args.e.data.id; // Get id from the deleted event

    try {
      await ComeAwayApi.deleteVisitor(id, username);
    } catch (errors) {
      return;
    }
  }

  async function onEventClick() {
    const modalHtml = `<div>
        <h2>Name: ${visitorData.fullName}</h2>
        <h2>Note: ${visitorData.note}</h2>
      </div>`;
    DayPilot.Modal.alert(modalHtml);
  }

  async function getPreviousWeek() {
    const dp = calendarRef.current.control;
    dp.startDate = dp.startDate.addDays(-7);
    dp.update();
  }

  async function getNextWeek() {
    const dp = calendarRef.current.control;
    dp.startDate = dp.startDate.addDays(7);
    dp.update();
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.main}>
        <div className="week-change m-4">
          <button
            className="btn btn-sm btn-primary me-5"
            onClick={getPreviousWeek}
          >
            Previous
          </button>
          WEEK
          <button className="btn btn-sm btn-primary ms-5" onClick={getNextWeek}>
            Next
          </button>
        </div>
        <DayPilotCalendar
          viewType={"Week"}
          businessBeginsHour={calData.businessBeginsHour}
          businessEndsHour={calData.businessEndsHour}
          durationBarVisible={false}
          headerDateFormat={"dddd MM/dd/yy"}
          headerHeight={50}
          headerTextWrappingEnabled={true}
          allDayEvents={true}
          heightSpec={"BusinessHoursNoScroll"}
          hourWidth={80}
          cellHeight={40}
          startDate={startDateFromDueDate}
          startDay={startDateFromDueDate}
          events={visitorDataForDisplay}
          eventDeleteHandling={"Update"}
          onEventDeleted={handleDeleteVisitors}
          onEventClick={onEventClick}
          eventMoveHandling={"Disabled"}
          eventResizeHandling={"Disabled"}
          timeRangeSelectedHandling={"Disabled"}
          visibleStart={true}
          ref={calendarRef}
        />
      </div>
    </div>
  );
};

export default Calendar;

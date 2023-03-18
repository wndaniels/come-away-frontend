import { useState, useRef, useEffect, useContext } from "react";
import UserContext from "../Auth/UserContext";
import useLocalStorage from "../hooks/useLocalStorage";
import jwt from "jsonwebtoken";
import {
  DayPilot,
  DayPilotCalendar,
  DayPilotNavigator,
} from "@daypilot/daypilot-lite-react";
import ComeAwayApi from "../api/api";

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
  const [calData, setCalData] = useState({
    viewType: calViewData,
    businessBeginsHour: calAvailBegin,
    businessEndsHour: calAvailEnd,
  });

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

  const onTimeRangeSelected = async (args) => {
    const dp = calendarRef.current.control;
    const modal = await DayPilot.Modal.form(
      [
        { name: "Name:", id: "name" },
        { name: "Note:", id: "note" },
      ],
      {
        name: "John Doe",
        note: "Congratulations! We can't wait to meet your baby!",
      }
    );
    dp.clearSelection();
    if (!modal.result) return;
    dp.events.add({
      start: args.start,
      end: args.end,
      id: DayPilot.guid(),
      text: modal.result,
    });
  };

  const onEventClick = async (args) => {
    const dp = calendarRef.current.control;
    const modal = await DayPilot.Modal.prompt(
      "Update event text:",
      args.e.text()
    );
    if (!modal.result) return;
    const e = args.e;
    e.data.text = modal.result;
    dp.events.update(e);
  };

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
        <div className="week-change">
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
          viewType={calData.viewType}
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
          eventDeleteHandling={"Update"}
          timeRangeSelectedHandling={"Enabled"}
          onTimeRangeSelected={onTimeRangeSelected}
          onEventClick={onEventClick}
          visibleStart={true}
          ref={calendarRef}
        />
      </div>
    </div>
  );
};

export default Calendar;

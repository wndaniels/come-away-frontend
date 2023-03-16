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
    [token]
  );

  useEffect(() => {
    async function getCalDataByUser() {
      const userCalData = await ComeAwayApi.getCalData();
      userCalData.map((d) => {
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
  }, [currentUser]);

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

  return (
    <div style={styles.wrap}>
      <div style={styles.main}>
        <DayPilotCalendar
          viewType={calData.viewType}
          businessBeginsHour={calData.businessBeginsHour}
          businessEndsHour={calData.businessEndsHour}
          durationBarVisible={false}
          headerDateFormat={"dddd M/dd"}
          headerHeight={50}
          headerTextWrappingEnabled={true}
          heightSpec={"BusinessHoursNoScroll"}
          hourWidth={80}
          cellHeight={40}
          startDate={"2023-05-13"}
          eventDeleteHandling={"Update"}
          timeRangeSelectedHandling={"Enabled"}
          onTimeRangeSelected={onTimeRangeSelected}
          onEventClick={onEventClick}
          ref={calendarRef}
        />
      </div>
    </div>
  );
};

export default Calendar;

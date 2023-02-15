import { useState, useRef, useEffect } from "react";
import { DayPilot, DayPilotCalendar } from "@daypilot/daypilot-lite-react";
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

const Calendar = () => {
  const calendarRef = useRef(null);

  const [calViewData, setCalViewData] = useState([]);
  const [calAvailBegin, setCalAvailBegin] = useState([]);
  const [calAvailEnd, setCalAvailEnd] = useState([]);

  async function getViewData(viewType) {
    const viewRes = await ComeAwayApi.getCalViews(viewType);
    setCalViewData(viewRes);
  }

  async function getBeginHoursData(businessBeginsHour) {
    const beginHourRes = await ComeAwayApi.getBeginHours(businessBeginsHour);
    setCalAvailBegin(beginHourRes);
  }

  async function getEndHourData(businessEndsHour) {
    const endHourRes = await ComeAwayApi.getEndtHours(businessEndsHour);
    setCalAvailEnd(endHourRes);
  }

  useEffect(() => {
    getViewData([]);
    getBeginHoursData([]);
    getEndHourData([]);
  }, []);

  const onTimeRangeSelected = async (args) => {
    const dp = calendarRef.current.control;
    const modal = await DayPilot.Modal.prompt("Create a new event", "Event 1");
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
          {...calViewData[1]}
          {...calAvailBegin[11]}
          {...calAvailEnd[19]}
          durationBarVisible={false}
          headerDateFormat={"dddd M/dd"}
          headerHeight={50}
          headerTextWrappingEnabled={true}
          heightSpec={"BusinessHoursNoScroll"}
          hourWidth={80}
          cellHeight={40}
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

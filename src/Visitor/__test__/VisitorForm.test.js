import {
  render,
  fireEvent,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import VisitorForm from "../VisitorForm";
import { ComeAwayApi } from "../../api/api";
import VistorConfirmation from "../VisitorConfirmation";

jest.mock("../../api/api", () => ({
  ComeAwayApi: {
    getAllCals: () => [
      { id: 1, businessBeginsHour: 0, businessEndsHour: 8, userId: 1 },
      { id: 2, businessBeginsHour: 1, businessEndsHour: 9, userId: 2 },
    ],

    getAllUsers: () => [
      { id: 1, username: "testuser", firstName: "Test" },
      { id: 2, username: "testuser2", firstName: "Test2" },
    ],
    getBeginHours: () => [
      { businessBeginsHour: 0, hourTitle: "12:00 AM", isoTime: "00:00:00" },
      { businessBeginsHour: 1, hourTitle: "1:00 AM", isoTime: "01:00:00" },
      { businessBeginsHour: 2, hourTitle: "2:00 AM", isoTime: "02:00:00" },
      { businessBeginsHour: 3, hourTitle: "3:00 AM", isoTime: "03:00:00" },
      { businessBeginsHour: 4, hourTitle: "4:00 AM", isoTime: "04:00:00" },
      { businessBeginsHour: 5, hourTitle: "5:00 AM", isoTime: "05:00:00" },
      { businessBeginsHour: 6, hourTitle: "6:00 AM", isoTime: "06:00:00" },
      { businessBeginsHour: 7, hourTitle: "7:00 AM", isoTime: "07:00:00" },
      { businessBeginsHour: 8, hourTitle: "8:00 AM", isoTime: "08:00:00" },
      { businessBeginsHour: 9, hourTitle: "9:00 AM", isoTime: "09:00:00" },
      { businessBeginsHour: 10, hourTitle: "10:00 AM", isoTime: "10:00:00" },
    ],
    getEndHours: () => [
      { businessEndsHour: 1, hourTitle: "12:00 AM", isoTime: "00:00:00" },
      { businessEndsHour: 2, hourTitle: "1:00 AM", isoTime: "01:00:00" },
      { businessEndsHour: 3, hourTitle: "2:00 AM", isoTime: "02:00:00" },
      { businessEndsHour: 4, hourTitle: "3:00 AM", isoTime: "03:00:00" },
      { businessEndsHour: 5, hourTitle: "4:00 AM", isoTime: "04:00:00" },
      { businessEndsHour: 6, hourTitle: "5:00 AM", isoTime: "05:00:00" },
      { businessEndsHour: 7, hourTitle: "6:00 AM", isoTime: "06:00:00" },
      { businessEndsHour: 8, hourTitle: "7:00 AM", isoTime: "07:00:00" },
      { businessEndsHour: 9, hourTitle: "8:00 AM", isoTime: "08:00:00" },
      { businessEndsHour: 10, hourTitle: "9:00 AM", isoTime: "09:00:00" },
      { businessEndsHour: 11, hourTitle: "10:00 AM", isoTime: "10:00:00" },
    ],
    getYears: () => [
      { id: 1, year: "2023" },
      { id: 2, year: "2024" },
    ],
    getMonths: () => [
      { id: 1, month: "January" },
      { id: 2, month: "February" },
    ],
    getDays: () => [
      { id: 1, day: "1" },
      { id: 2, day: "2" },
    ],
    getAllDueDates: () => [
      {
        id: 1,
        babyName: "testbaby",
        yearId: 1,
        monthId: 1,
        dayId: 1,
        userId: 1,
      },
      {
        id: 2,
        babyName: "testbaby2",
        yearId: 2,
        monthId: 2,
        dayId: 2,
        userId: 2,
      },
    ],
    createVisit: jest.fn(),
  },
}));

describe("VisitorForm component", () => {
  it("should render VisitorForm", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/visitor/testuser/calendar/visit"]}>
          <Routes>
            <Route
              path="/visitor/:username/calendar/visit"
              element={<VisitorForm />}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Schedule a Visit!")).toBeInTheDocument();
  });

  it("should update state when form inputs are changed", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/visitor/testuser/calendar/visit"]}>
          <Routes>
            <Route
              path="/visitor/:username/calendar/visit"
              element={<VisitorForm />}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    expect(screen.getByText("Schedule a Visit!")).toBeInTheDocument();

    // Wait for the form to load
    const nameInput = await screen.getByLabelText("* Name of Visitor(s):");

    fireEvent.change(nameInput, {
      target: { value: "John Doe" },
    });

    expect(nameInput.value).toBe("John Doe");
  });

  it("should generate correct options for the visit day select input", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/visitor/testuser/calendar/visit"]}>
          <Routes>
            <Route
              path="/visitor/:username/calendar/visit"
              element={<VisitorForm />}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    const dateSelect = screen.getByLabelText(
      /What day would you like to visit?/i
    );
    const dateOption = within(dateSelect).getByText("01-01-2023");
    expect(dateOption).toBeInTheDocument();
  });

  it("should generate correct options for the start and end time select inputs", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/visitor/testuser/calendar/visit"]}>
          <Routes>
            <Route
              path="/visitor/:username/calendar/visit"
              element={<VisitorForm />}
            />
          </Routes>
        </MemoryRouter>
      );
    });

    const startTimeSelect = screen.getByLabelText(
      / What time would you like to visit?/i
    );
    const endTimeSelect = screen.getByLabelText(
      /Select an end time for your visit/i
    );
    const startTimeOption = within(startTimeSelect).getByText("12:00 AM");
    const endTimeOption = within(endTimeSelect).getByText("1:00 AM");
    expect(startTimeOption).toBeInTheDocument();
    expect(endTimeOption).toBeInTheDocument();
  });

  it("should handle form submission and navigate", async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={["/visitor/testuser/calendar/visit"]}>
          <Routes>
            <Route
              path="/visitor/:username/calendar/visit"
              element={<VisitorForm />}
            />
            <Route path="/thankyou" element={<VistorConfirmation />} />
          </Routes>
        </MemoryRouter>
      );
    });

    // Fill out the form and submit it.
    const nameInput = screen.getByLabelText(/Name of Visitor/i);
    const noteInput = screen.getByLabelText(/Leave a note for the family/i);
    const dateInput = screen.getByLabelText(
      /What day would you like to visit/i
    );
    const startInput = screen.getByLabelText(
      /What time would you like to visit/i
    );
    const endInput = screen.getByLabelText(
      /Select an end time for your visit/i
    );

    fireEvent.change(nameInput, { target: { value: "Test Visitor" } });
    fireEvent.change(noteInput, { target: { value: "Hello" } });
    fireEvent.change(dateInput, { target: { value: "2023-01-01" } });
    fireEvent.change(startInput, { target: { value: "01:00:00" } });
    fireEvent.change(endInput, { target: { value: "02:00:00" } });

    const submitButton = screen.getByText(/Schedule your visit/i);
    fireEvent.click(submitButton);

    // Wait for the navigation to occur.
    await waitFor(() => screen.getByText(/Signup Confirmed!/i));

    // Check that the ComeAwayApi.createVisit was called with the correct data.
    expect(ComeAwayApi.createVisit).toHaveBeenCalledWith({
      fullName: "Test Visitor",
      note: "Hello",
      startTime: "2023-01-01T01:00:00",
      endTime: "2023-01-01T02:00:00",
      calendarId: 1,
    });
  });
});

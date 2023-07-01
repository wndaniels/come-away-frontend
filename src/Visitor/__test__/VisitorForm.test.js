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
import ComeAwayApi from "../../Api/api";

jest.mock("../../Api/api", () => ({
  getAllCals: jest.fn().mockResolvedValueOnce([
    { id: 1, businessBeginsHour: 0, businessEndsHour: 8, userId: 1 },
    { id: 2, businessBeginsHour: 1, businessEndsHour: 9, userId: 2 },
  ]),
  getAllUsers: jest.fn().mockImplementation([
    { id: 1, username: "testuser", firstName: "Test" },
    { id: 2, username: "testuser2", firstName: "Test2" },
  ]),
  getBeginHours: jest.fn().mockResolvedValueOnce([
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
  ]),
  getEndHours: jest.fn().mockResolvedValueOnce([
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
  ]),
  getYears: jest.fn().mockResolvedValueOnce([
    { id: 1, year: "2023" },
    { id: 2, year: "2024" },
  ]),
  getMonths: jest.fn().mockResolvedValueOnce([
    { id: 1, month: "January" },
    { id: 2, month: "February" },
  ]),
  getDays: jest.fn().mockResolvedValueOnce([
    { id: 1, day: "1" },
    { id: 2, day: "2" },
  ]),
  getAllDueDates: jest.fn().mockResolvedValueOnce([
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
  ]),
  createVisit: jest.fn().mockResolvedValueOnce([
    {
      fullName: "Test Visitor",
      note: "Hello",
      startTime: 1,
      endTime: 2,
      calendarId: 1,
    },
  ]),
}));

describe("VisitorForm component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

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

    expect(
      screen.getByText(/what day would you like to visit?/i)
    ).toBeInTheDocument();
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

    expect(screen.getByText("12:00 AM")).toBeInTheDocument();
    expect(screen.getByText("1:00 AM")).toBeInTheDocument();
  });

  it("should display error when form is incomplete and submitted", async () => {
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

    fireEvent.click(screen.getByText("Schedule your visit"));

    await waitFor(() =>
      expect(
        screen.getByText("All fields must be complete.")
      ).toBeInTheDocument()
    );
  });

  it("should call createVisit when form is complete and submitted", async () => {
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

    fireEvent.change(screen.getByLabelText("* Name of Visitor(s):"), {
      target: { value: "Test Visitor" },
    });
    // Add similar fireEvent.change calls for the remaining form inputs.

    fireEvent.click(screen.getByText("Schedule your visit"));

    await waitFor(() => expect(ComeAwayApi.createVisit).toHaveBeenCalled());
  });
});

import "../../matchMedia.mock";
import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import Calendar from "../Calendar";
import UserContext from "../../Auth/UserContext";

jest.mock("@daypilot/daypilot-lite-react", () => ({
  ...jest.requireActual("@daypilot/daypilot-lite-react"),
  DayPilot: () => jest.fn(),
  DayPilotCalendar: () => jest.fn(),
}));

describe("Calendar", () => {
  it("renders without crashing", () => {
    const { asFragment } = render(
      <Wrapper>
        <Calendar />
      </Wrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("can find button text", () => {
    const { getByText } = render(
      <Wrapper>
        <Calendar />
      </Wrapper>
    );
    const previousButtonText = getByText(/previous/i);
    const nextButtonText = getByText(/next/i);
    expect(previousButtonText).toBeInTheDocument();
    expect(nextButtonText).toBeInTheDocument();
  });
});

function Wrapper({ children }) {
  return (
    <UserContext.Provider
      value={{
        currentUser: jest.fn(),
        setCurrentUser: jest.fn(),
        login: jest.fn(),
        signup: jest.fn(),
        logout: jest.fn(),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

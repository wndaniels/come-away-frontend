import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import CalendarForm from "../CalendarForm";
import UserContext from "../../Auth/UserContext";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("CalendarForm", () => {
  it("renders without crashing", () => {
    const { asFragment } = render(
      <Wrapper>
        <CalendarForm />
      </Wrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("can find placeholder", () => {
    const { getByText } = render(
      <Wrapper>
        <CalendarForm />
      </Wrapper>
    );
    const startTimeSelect = getByText(/select start time:/i);
    expect(startTimeSelect).toBeInTheDocument();
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

import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import CalendarEditForm from "../CalendarEditForm";
import UserContext from "../../Auth/UserContext";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("CalendarEditForm", () => {
  it("renders without crashing", () => {
    const { asFragment } = render(
      <Wrapper>
        <CalendarEditForm />
      </Wrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("can find placeholder", () => {
    const { getByRole, getByText } = render(
      <Wrapper>
        <CalendarEditForm />
      </Wrapper>
    );

    const heading = getByRole("heading", {
      name: /edit calendar/i,
      class: "mb-3",
    });
    const deleteButtonText = getByText(/delete/i);

    expect(heading).toBeInTheDocument();
    expect(deleteButtonText).toBeInTheDocument();
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

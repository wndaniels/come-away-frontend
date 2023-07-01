import React from "react";
import { getByRole, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import DueDateForm from "../DueDateForm";
import UserContext from "../../Auth/UserContext";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("DueDateEditForm", () => {
  it("renders without crashing", () => {
    const { asFragment } = render(
      <Wrapper>
        <DueDateForm />
      </Wrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("can find heading", () => {
    const { getByRole } = render(
      <Wrapper>
        <DueDateForm />
      </Wrapper>
    );

    const heading = getByRole("heading", /tell us about baby!/i);
    expect(heading).toBeInTheDocument();
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

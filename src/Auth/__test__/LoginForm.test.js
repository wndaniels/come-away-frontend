import React from "react";
import { render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import LoginForm from "../LoginForm";
import UserContext from "../UserContext";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("LoginForm", () => {
  it("renders without crashing", () => {
    const { asFragment } = render(
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("can find placeholder", () => {
    const { getByPlaceholderText } = render(
      <Wrapper>
        <LoginForm />
      </Wrapper>
    );
    const usernamePlaceholder = getByPlaceholderText(/username/i);
    expect(usernamePlaceholder).toBeInTheDocument();
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

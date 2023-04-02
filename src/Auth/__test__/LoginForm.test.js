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
  it("renders without crashingt", () => {
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

// describe("LoginForm", () => {
//   it("renders without crashing", () => {
//     const mock = jest.fn(() => "I am a mock function");
//     expect(mock("Calling LoginForm")).toBe("I am a mock function");
//     expect(mock).toHaveBeenCalledWith("Calling LoginForm");
//   });

//   it("mock return value of a function one time", () => {
//     const mock = jest.fn();
//     mock.mockReturnValueOnce("Hello").mockReturnValueOnce("there!");
//     mock();
//     mock();

//     expect(mock).toHaveBeenCalledTimes(2);
//   });
// });

// it("should redirect user to homepage after login", () => {});

// describe("handle submit functionality", () => {
//   const handleSubmitMock = jest.fn();

//   test("should submit", () => {

//   })
// });

function Wrapper({ children }) {
  return (
    <UserContext.Provider
      value={{
        login: jest.fn(),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

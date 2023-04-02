import React, { useContext } from "react";
import LoginForm from "../LoginForm";
import { render, screen, getAllByText } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";

jest.mock("../LoginForm");

it("renders without crashingt", async () => {
  const { asFragment } = await render(<LoginForm />);

  expect(asFragment(<LoginForm />)).toMatchSnapshot();
});

it("can find placeholder", async () => {
  await render(<LoginForm />);
  const usernamePlaceholder = screen.getAllByText(/"Username"/);
  console.log(usernamePlaceholder);
  expect(usernamePlaceholder).toBeInTheDocument();
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

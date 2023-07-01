import "../../matchMedia.mock";
import React from "react";
import { getByRole, render } from "@testing-library/react";
import { createMemoryRouter, Outlet, RouterProvider } from "react-router-dom";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import PrivateRoute from "../PrivateRoute";
import Calendar from "../../Calendar/Calendar";
import UserContext from "../../Auth/UserContext";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Navigate: () => jest.fn(),
}));

describe("PrivateRoute", () => {
  it("renders without crashing", () => {
    const { asFragment } = render(
      <Wrapper initialEntries={["/:username/calendar"]}>
        <PrivateRoute>
          <Calendar />
        </PrivateRoute>
      </Wrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  //   it("can find heading", () => {
  //     const { getByRole } = render(
  //       <Wrapper>
  //         <PrivatePaths />
  //       </Wrapper>
  //     );

  //     const anchorTag = getByRole("link", {
  //       name: "COME/AWAY",
  //       class: "navbar-brand",
  //     });
  //     expect(anchorTag).toBeInTheDocument();
  //   });
});

function Wrapper({ children }) {
  return (
    <UserContext.Provider
      value={{
        currentUser: { username: "yupp1234" },
        // setCurrentUser: jest.fn(),
        // login: jest.fn(),
        // signup: jest.fn(),
        // logout: jest.fn(),
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

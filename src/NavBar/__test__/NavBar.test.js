import "../../matchMedia.mock";
import React from "react";
import { getByRole, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import NavBar from "../NavBar";
import UserContext from "../../Auth/UserContext";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("NavBar", () => {
  it("renders without crashing", () => {
    const { asFragment } = render(
      <Wrapper>
        <NavBar />
      </Wrapper>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("can find heading", () => {
    const { getByRole } = render(
      <Wrapper>
        <NavBar />
      </Wrapper>
    );

    const anchorTag = getByRole("link", {
      name: "COME/AWAY",
      class: "navbar-brand",
    });
    expect(anchorTag).toBeInTheDocument();
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

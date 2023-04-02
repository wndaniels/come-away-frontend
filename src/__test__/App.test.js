import "../matchMedia.mock";
import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../App";
jest.mock("../App");

it("renders without crashingt", () => {
  const { asFragment } = render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  expect(
    asFragment(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
  ).toMatchSnapshot();
});
npm;

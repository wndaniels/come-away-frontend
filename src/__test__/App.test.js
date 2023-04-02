import "../matchMedia.mock";
import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

it("renders without crashingt", () => {
  const { asFragment } = render(<App />);
  expect(asFragment()).toMatchSnapshot();
});

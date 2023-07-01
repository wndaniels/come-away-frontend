import "../matchMedia.mock";
import React from "react";
import { render } from "@testing-library/react";
import App from "../App";

describe("App", () => {
  it("renders without crashingu", () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});

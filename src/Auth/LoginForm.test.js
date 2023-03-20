window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

import { render } from "@testing-library/react";
import LoginForm from "./LoginForm";

test("it renders without crashing", () => {
  render(<LoginForm />);
});

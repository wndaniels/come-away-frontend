import { createBrowserRouter, RouterProvider } from "react-router-dom";

import routerConfig from "./routerConfig.js";

const router = createBrowserRouter(routerConfig);

function Paths() {
  return <RouterProvider router={router} />;
}

export default Paths;

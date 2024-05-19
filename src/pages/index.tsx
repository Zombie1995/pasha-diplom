import { Navigate, createBrowserRouter } from "react-router-dom";
import Graph from "./graph";
import Login from "./login";
import Register from "./register";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace={true} />,
  },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/graph", element: <Graph /> },
]);

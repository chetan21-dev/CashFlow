import { createBrowserRouter } from "react-router-dom";
import Layout from "../pages/layout/Layout";
import Home from "../pages/home/Home";
import Register from "../pages/register/Register";
import Login from "../pages/login/Login";
import { ProtectedRoute } from "./ProtectedRoute";
import Transact from "../pages/transact/Transact";
import Deposit from "../pages/deposit/Deposit";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path : "/register",
        element: <Register/>
      },
      {
        path : "/login",
        element: <Login/>
      },
      {
        element : <ProtectedRoute/>,
        children : [
          {
            path : "/transact",
            element : <Transact/>
          },
          {
            path : "/deposit",
            element : <Deposit/>
          }
        ]
      }
    ],
  },
]);

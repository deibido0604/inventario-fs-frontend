import { lazy } from "react";

const LoginPage = lazy(() => import("./LoginPage"));

export default [
  {
    path: "login",
    children: [
      {
        index: true,
        element: LoginPage,
      },
    ],
  },
];

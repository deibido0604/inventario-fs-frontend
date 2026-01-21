import { lazy } from "react";
import { permissions } from "@utils";

const Branch = lazy(() => import("./pages/Branch"));

export default [
  {
    path: "branch",
    children: [
      {
        index: true,
        element: Branch,
        subject: permissions.Subjects.BRANCH,
        action: permissions.Actions.READ,
      },
    ],
  },
];

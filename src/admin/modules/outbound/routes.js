import { lazy } from "react";
import { permissions } from "@utils";

const Outbound = lazy(() => import("./pages/Outbound"));

export default [
  {
    path: "outbound",
    children: [
      {
        index: true,
        element: Outbound,
        subject: permissions.Subjects.OUTBOUND,
        action: permissions.Actions.READ,
      },
    ],
  },
];

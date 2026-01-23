import { lazy } from "react";
import { permissions } from "@utils";

const Outbound = lazy(() => import("./pages/Outbound"));
const OutboundList = lazy(() => import("./pages/OutboundList"));


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
  {
    path: "outbound-list",
    children: [
      {
        index: true,
        element: OutboundList,
        subject: permissions.Subjects.OUTBOUND_LIST,
        action: permissions.Actions.READ,
      },
    ],
  },
];

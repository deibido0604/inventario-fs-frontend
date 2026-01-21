import { lazy } from "react";
import { permissions } from "@utils";

const Products = lazy(() => import("./pages/Products"));

export default [
  {
    path: "products",
    children: [
      {
        index: true,
        element: Products,
        subject: permissions.Subjects.PRODUCTS,
        action: permissions.Actions.READ,
      },
    ],
  },
];

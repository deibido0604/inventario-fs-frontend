import { Navigate } from "react-router-dom";
import dashboardRoutes from "./modules/dashboard/routes";
import productsRoutes from "./modules/products/routes";
import branchRoutes from "./modules/branch/routes";
import outboundRoutes from "./modules/outbound/routes"

export default [
  ...dashboardRoutes,
  ...productsRoutes,
  ...branchRoutes,
  ...outboundRoutes,
  { path: "*", to: "dashboard", element: Navigate },
];

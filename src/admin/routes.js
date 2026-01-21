import { Navigate } from 'react-router-dom';
import dashboardRoutes from './modules/dashboard/routes';
import productsRoutes from './modules/products/routes';

export default [
  ...dashboardRoutes,
  ...productsRoutes,
  { path: '*', to: 'dashboard', element: Navigate },
];

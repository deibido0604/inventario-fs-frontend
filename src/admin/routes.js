import { Navigate } from 'react-router-dom';
import dashboardRoutes from './modules/dashboard/routes';

export default [
  ...dashboardRoutes,
  { path: '*', to: 'dashboard', element: Navigate },
];

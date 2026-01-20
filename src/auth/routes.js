import { Navigate } from 'react-router-dom';
import loginRoutes from './pages/routes';

export default [...loginRoutes, { path: '*', to: 'login', element: Navigate }];

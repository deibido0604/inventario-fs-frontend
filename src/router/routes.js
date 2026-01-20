import { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import { permissions } from '@utils';

const Auth = lazy(() => import('../auth/pages/Main'));
const Main = lazy(() => import('../admin/modules/main/Main'));

const routes = [
  {
    path: '/auth/*',
    element: Auth,
  },
  {
    path: '/main/*',
    element: Main,
    subject: permissions.Subjects.MAIN,
    action: permissions.Actions.READ,
  },
  {
    path: '*',
    to: '/auth/login',
    element: Navigate,
  },
];

export default routes;

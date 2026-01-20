import { lazy } from 'react';
import { permissions } from '@utils';

const DashboardPage = lazy(() => import('./Dashboard'));

export default [
  {
    path: 'dashboard',
    children: [
      {
        index: true,
        element: DashboardPage,
        subject: permissions.Subjects.DASHBOARD,
        action: permissions.Actions.READ,
      },
    ],
  },
];

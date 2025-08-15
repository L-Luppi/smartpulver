import { createBrowserRouter } from 'react-router-dom';
import DashboardLayout from '../components/organisms/DashboardLayout';

import Home from '../pages/Home';
export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout
     />,
    children: [
      {
        path: '',
        element: <Home />,
      },
    ],
  },
]);
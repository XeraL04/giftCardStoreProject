import { createBrowserRouter, Outlet } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import GiftCardPage from '../features/giftcards/GiftCardDetail';

// users routes
import { AuthRoute } from '../components/users/AuthRoute';
import UserDashboard from '../pages/users/UserDashboard';
import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
import { DashboardProfileSection } from '../components/users/DashboardProfileSection';
import OrdersListPage from '../pages/users/OrdersListPage';
import ProfileEditPage from '../pages/users/ProfileEditPage';
import ShopPage from '../pages/users/ShopPage';
import Cart from '../pages/users/Cart';
import Cancel from '../pages/users/Cancel';
import Success from '../pages/users/Success';

export const router = createBrowserRouter([
  {
    element: <PublicLayout><Outlet /></PublicLayout>,
    children: [
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/giftcards/:id', element: <GiftCardPage /> },
    ],
  },
  {
    element: <AuthRoute><AuthenticatedLayout><Outlet /></AuthenticatedLayout></AuthRoute>,
    children: [
      { path: '/dashboard', element: <UserDashboard /> },
      { path: '/shop', element: <ShopPage /> },
      { path: '/cart', element: <Cart /> },
      { path: '/profile', element: <DashboardProfileSection /> },
      { path: '/orders', element: <OrdersListPage /> },
      { path: '/profile/edit', element: <ProfileEditPage /> },
      { path: '/success', element: <Success />},
      { path: '/cancel', element: <Cancel />},
    ],
  }
]);

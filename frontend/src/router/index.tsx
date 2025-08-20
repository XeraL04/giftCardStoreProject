import { createBrowserRouter } from 'react-router-dom';
import RootLayoutSwitcher from '../layouts/RootLayoutSwitcher';

import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import GiftCardDetail from '../features/giftcards/GiftCardDetail';

import Cart from '../pages/users/Cart';
import UserDashboard from '../pages/users/UserDashboard';
import { DashboardProfileSection } from '../components/users/DashboardProfileSection';
import OrdersListPage from '../pages/users/OrdersListPage';
import ProfileEditPage from '../pages/users/ProfileEditPage';
import ShopPage from '../pages/users/ShopPage';
import CheckoutSuccess from '../pages/users/checkout/CheckoutSuccess';

import { AuthRoute } from '../components/users/AuthRoute';
import { AdminRoute } from '../components/admin/AdminRoute';

import AdminUsers from '../pages/admin/AdminUsers';
import AdminGiftCards from '../pages/admin/AdminGiftCards';
import AdminSales from '../pages/admin/AdminSales';
import AdminUserProfile from '../pages/admin/AdminUserProfile';
import PendingPayment from '../pages/users/checkout/PendingPayment';
import ProofViewer from '../components/users/ProofViewer';

export const router = createBrowserRouter([
  {
    element: <RootLayoutSwitcher />,
    children: [
      // Public & User-Specific Routes
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/giftcards/:id', element: <GiftCardDetail /> },
      
      // Routes for authenticated users. The AuthRoute will handle access control.
      { path: '/dashboard', element: <AuthRoute><UserDashboard /></AuthRoute> },
      { path: '/shop', element: <AuthRoute><ShopPage /></AuthRoute> },
      { path: '/cart', element: <AuthRoute><Cart /></AuthRoute> },
      { path: '/profile', element: <AuthRoute><DashboardProfileSection /></AuthRoute> },
      { path: '/orders', element: <AuthRoute><OrdersListPage /></AuthRoute> },
      { path: '/profile/edit', element: <AuthRoute><ProfileEditPage /></AuthRoute> },
      { path: '/checkout/success', element: <AuthRoute><CheckoutSuccess /></AuthRoute> },
      { path: '/checkout/pending-payment', element: <AuthRoute><PendingPayment /></AuthRoute> },
      { path: '/proofs/:orderId', element: <AuthRoute><ProofViewer /></AuthRoute> },

      // Admin-specific routes. The AdminRoute will handle access control.
      { path: '/admin', element: <AdminRoute><AdminUsers /></AdminRoute> },
      { path: '/admin/users', element: <AdminRoute><AdminUsers /></AdminRoute> },
      { path: '/admin/giftcards', element: <AdminRoute><AdminGiftCards /></AdminRoute> },
      { path: '/admin/sales', element: <AdminRoute><AdminSales /></AdminRoute> },
      { path: '/admin/users/:id', element: <AdminUserProfile /> }
    ],
  },
]);
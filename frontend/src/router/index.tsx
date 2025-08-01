// src/router/index.tsx
import { createBrowserRouter, Outlet } from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import GiftCardDetail from '../features/giftcards/GiftCardDetail';
import Cart from '../pages/users/Cart';

import { AuthRoute } from '../components/users/AuthRoute';

// Components for authenticated routes
import UserDashboard from '../pages/users/UserDashboard';
import { DashboardProfileSection } from '../components/users/DashboardProfileSection';
import OrdersListPage from '../pages/users/OrdersListPage';
import ProfileEditPage from '../pages/users/ProfileEditPage';
import ShopPage from '../pages/users/ShopPage';
import CheckoutSuccess from '../pages/users/checkout/CheckoutSuccess';

// New layout switcher component
import RootLayoutSwitcher from '../layouts/RootLayoutSwitcher';

export const router = createBrowserRouter([
  {
    // This is the new, single parent route that decides the layout
    element: <RootLayoutSwitcher />,
    children: [
      // Public-only routes
      { path: '/', element: <Home /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      
      // The shared gift card detail page. It will now be wrapped by the correct layout.
      { path: '/giftcards/:id', element: <GiftCardDetail /> },

      // All authenticated routes will also be wrapped by the same layout switcher
      // But we still need the AuthRoute component for protection
      {
        element: <AuthRoute><Outlet /></AuthRoute>,
        children: [
          { path: '/dashboard', element: <UserDashboard /> },
          { path: '/shop', element: <ShopPage /> },
          { path: '/cart', element: <Cart /> },
          { path: '/profile', element: <DashboardProfileSection /> },
          { path: '/orders', element: <OrdersListPage /> },
          { path: '/profile/edit', element: <ProfileEditPage /> },
          { path: '/checkout/success', element: <CheckoutSuccess /> },
        ],
      },
    ],
  },
]);








// import { createBrowserRouter, Outlet } from 'react-router-dom';
// import PublicLayout from '../layouts/PublicLayout';
// import Home from '../pages/Home';
// import Login from '../pages/Login';
// import Register from '../pages/Register';
// import GiftCardPage from '../features/giftcards/GiftCardDetail';

// // users routes
// import { AuthRoute } from '../components/users/AuthRoute';
// import UserDashboard from '../pages/users/UserDashboard';
// import AuthenticatedLayout from '../layouts/AuthenticatedLayout';
// import { DashboardProfileSection } from '../components/users/DashboardProfileSection';
// import OrdersListPage from '../pages/users/OrdersListPage';
// import ProfileEditPage from '../pages/users/ProfileEditPage';
// import ShopPage from '../pages/users/ShopPage';
// import Cart from '../pages/users/Cart';
// import CheckoutSuccess from '../pages/users/checkout/CheckoutSuccess';

// export const router = createBrowserRouter([
//   {
//     element: <PublicLayout><Outlet /></PublicLayout>,
//     children: [
//       { path: '/', element: <Home /> },
//       { path: '/login', element: <Login /> },
//       { path: '/register', element: <Register /> },
//       { path: '/giftcards/:id', element: <GiftCardPage /> },
//     ],
//   },
//   {
//     element: <AuthRoute><AuthenticatedLayout><Outlet /></AuthenticatedLayout></AuthRoute>,
//     children: [
//       { path: '/dashboard', element: <UserDashboard /> },
//       { path: '/shop', element: <ShopPage /> },
//       { path: '/giftcards/:id', element: <GiftCardPage /> },
//       { path: '/cart', element: <Cart /> },
//       { path: '/profile', element: <DashboardProfileSection /> },
//       { path: '/orders', element: <OrdersListPage /> },
//       { path: '/profile/edit', element: <ProfileEditPage /> },
//       { path: '/checkout/success', element: <CheckoutSuccess /> },
//     ],
//   }
// ]);

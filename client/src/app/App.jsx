import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout } from "./Layout";
import { HomePage } from "./HomePage";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";

const NewReleasesPage = lazy(() =>
  import("./NewReleasesPage").then((m) => ({ default: m.NewReleasesPage })),
);
const CategoriesPage = lazy(() =>
  import("./CategoriesPage").then((m) => ({ default: m.CategoriesPage })),
);
const ShopPage = lazy(() =>
  import("./ShopPage").then((m) => ({ default: m.ShopPage })),
);
const ProductDetailPage = lazy(() =>
  import("./ProductDetailPage").then((m) => ({ default: m.ProductDetailPage })),
);
const CartPage = lazy(() =>
  import("./CartPage").then((m) => ({ default: m.CartPage })),
);
const LoginPage = lazy(() =>
  import("./LoginPage").then((m) => ({ default: m.LoginPage })),
);
const RegisterPage = lazy(() =>
  import("./RegisterPage").then((m) => ({ default: m.RegisterPage })),
);
const AccountPage = lazy(() =>
  import("../features/account").then((m) => ({ default: m.AccountPage })),
);
const OrdersPage = lazy(() =>
  import("../features/account").then((m) => ({ default: m.OrdersPage })),
);
const OrderDetailPage = lazy(() =>
  import("../features/account").then((m) => ({ default: m.OrderDetailPage })),
);

const AdminLayout = lazy(() =>
  import("../features/admin/AdminLayout").then((m) => ({ default: m.AdminLayout })),
);
const AdminOverviewPage = lazy(() =>
  import("../features/admin/pages/AdminOverviewPage").then((m) => ({ default: m.AdminOverviewPage })),
);
const AdminOrdersPage = lazy(() =>
  import("../features/admin/pages/AdminOrdersPage").then((m) => ({ default: m.AdminOrdersPage })),
);
const AdminProductsPage = lazy(() =>
  import("../features/admin/pages/AdminProductsPage").then((m) => ({ default: m.AdminProductsPage })),
);
const AdminCustomersPage = lazy(() =>
  import("../features/admin/pages/AdminCustomersPage").then((m) => ({ default: m.AdminCustomersPage })),
);

const suspenseFallback = <div className="py-20 text-center text-text-muted">Loading...</div>;

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/new-releases",
        element: <Suspense fallback={suspenseFallback}><NewReleasesPage /></Suspense>,
      },
      {
        path: "/shop",
        element: <Suspense fallback={suspenseFallback}><ShopPage /></Suspense>,
      },
      {
        path: "/products/:slug",
        element: <Suspense fallback={suspenseFallback}><ProductDetailPage /></Suspense>,
      },
      {
        path: "/products",
        element: <Suspense fallback={suspenseFallback}><CategoriesPage /></Suspense>,
      },
      {
        path: "/register",
        element: <Suspense fallback={suspenseFallback}><RegisterPage /></Suspense>,
      },
      {
        path: "/login",
        element: <Suspense fallback={suspenseFallback}><LoginPage /></Suspense>,
      },
      {
        path: "/cart",
        element: (
          <ProtectedRoute>
            <Suspense fallback={suspenseFallback}><CartPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/account",
        element: (
          <ProtectedRoute>
            <Suspense fallback={suspenseFallback}><AccountPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/account/orders",
        element: (
          <ProtectedRoute>
            <Suspense fallback={suspenseFallback}><OrdersPage /></Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: "/account/orders/:id",
        element: (
          <ProtectedRoute>
            <Suspense fallback={suspenseFallback}><OrderDetailPage /></Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredRole="admin">
        <Suspense fallback={suspenseFallback}>
          <AdminLayout />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Suspense fallback={suspenseFallback}><AdminOverviewPage /></Suspense> },
      { path: "orders", element: <Suspense fallback={suspenseFallback}><AdminOrdersPage /></Suspense> },
      { path: "products", element: <Suspense fallback={suspenseFallback}><AdminProductsPage /></Suspense> },
      { path: "customers", element: <Suspense fallback={suspenseFallback}><AdminCustomersPage /></Suspense> },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

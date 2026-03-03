import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Layout } from "./Layout";
import { HomePage } from "./HomePage";

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

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        path: "/new-releases",
        element: (
          <Suspense fallback={<div className="py-20 text-center text-text-muted">Loading...</div>}>
            <NewReleasesPage />
          </Suspense>
        ),
      },
      {
        path: "/shop",
        element: (
          <Suspense fallback={<div className="py-20 text-center text-text-muted">Loading...</div>}>
            <ShopPage />
          </Suspense>
        ),
      },
      {
        path: "/products/:slug",
        element: (
          <Suspense fallback={<div className="py-20 text-center text-text-muted">Loading...</div>}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: "/products",
        element: (
          <Suspense fallback={<div className="py-20 text-center text-text-muted">Loading...</div>}>
            <CategoriesPage />
          </Suspense>
        ),
      },
      {
        path: "/register",
        element: (
          <Suspense fallback={<div className="py-20 text-center text-text-muted">Loading...</div>}>
            <RegisterPage />
          </Suspense>
        ),
      },
      {
        path: "/login",
        element: (
          <Suspense fallback={<div className="py-20 text-center text-text-muted">Loading...</div>}>
            <LoginPage />
          </Suspense>
        ),
      },
      {
        path: "/cart",
        element: (
          <Suspense fallback={<div className="py-20 text-center text-text-muted">Loading...</div>}>
            <CartPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

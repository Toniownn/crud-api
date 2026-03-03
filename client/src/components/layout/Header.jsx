import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/cn";
import { useCartStore } from "../../lib/cart-store";
import { useAuthStore } from "../../lib/auth-store";
import { SITE_NAME } from "../../lib/constants";
import { NAV_LINKS } from "../../lib/mock-data";
import { Button } from "../ui/Button";
import { Container } from "./Container";

export function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const cartCount = useCartStore((s) => s.totalItems());
  const loadCart = useCartStore((s) => s.loadCart);
  const customer = useAuthStore((s) => s.customer);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);
  const isAuthenticated = !!token;

  useEffect(() => {
    loadCart();
  }, [token]);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="font-display text-xl text-text-primary">
            {SITE_NAME}
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium text-text-secondary transition-colors duration-fast hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-2 md:flex">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-text-secondary">
                    {customer?.fname}
                  </span>
                  <Button variant="ghost" size="sm" onClick={logout}>
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" size="sm">Log in</Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Register</Button>
                  </Link>
                </>
              )}
            </div>

            <Link
              to="/cart"
              className="relative inline-flex min-h-11 min-w-11 items-center justify-center text-text-secondary transition-colors duration-fast hover:text-text-primary"
              aria-label={`Cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-text-secondary transition-colors duration-fast hover:text-text-primary md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileNavOpen}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {mobileNavOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </>
                ) : (
                  <>
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </Container>

      <div
        className={cn(
          "overflow-hidden border-t border-border transition-all duration-normal md:hidden",
          mobileNavOpen ? "max-h-60" : "max-h-0 border-t-transparent",
        )}
      >
        <Container>
          <nav className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="inline-flex min-h-11 items-center text-sm font-medium text-text-secondary transition-colors duration-fast hover:text-text-primary"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-border pt-3">
              {isAuthenticated ? (
                <Button variant="outline" size="sm" className="w-full" onClick={logout}>
                  Log out
                </Button>
              ) : (
                <>
                  <Link to="/login" className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">Log in</Button>
                  </Link>
                  <Link to="/register" className="flex-1">
                    <Button size="sm" className="w-full">Register</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </Container>
      </div>
    </header>
  );
}

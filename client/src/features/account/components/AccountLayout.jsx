import { useState } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "../../../lib/cn";
import { useAuthStore } from "../../../lib/auth-store";
import { Container } from "../../../components/layout/Container";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";

const NAV_ITEMS = [
  { label: "Profile", to: "/account", end: true },
  { label: "Orders", to: "/account/orders" },
];

export function AccountLayout({ children }) {
  const logout = useAuthStore((s) => s.logout);
  const [showLogout, setShowLogout] = useState(false);

  return (
    <Container>
      <div className="py-10">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-text-primary">
          My Account
        </h1>

        <div className="mt-8 flex flex-col gap-8 md:flex-row">
          <nav className="flex shrink-0 flex-row gap-1 md:w-60 md:flex-col">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "min-h-11 flex items-center rounded-lg px-4 text-sm font-medium transition-colors duration-fast",
                    isActive
                      ? "bg-brand/10 text-brand"
                      : "text-text-secondary hover:bg-surface-alt hover:text-text-primary",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}

            <button
              onClick={() => setShowLogout(true)}
              className="min-h-11 flex items-center rounded-lg px-4 text-sm font-medium text-text-secondary transition-colors duration-fast hover:bg-surface-alt hover:text-error"
            >
              Log out
            </button>
          </nav>

          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </div>
      <Modal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        title="Log out"
        className="max-w-sm"
      >
        <p className="text-sm text-text-secondary">
          Are you sure you want to log out?
        </p>
        <div className="mt-6 flex gap-3">
          <Button
            variant="primary"
            size="sm"
            className="bg-error hover:bg-error/80"
            onClick={logout}
          >
            Log out
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLogout(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </Container>
  );
}

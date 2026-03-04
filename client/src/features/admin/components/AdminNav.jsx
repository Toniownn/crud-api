import { NavLink } from "react-router-dom";
import { cn } from "../../../lib/cn";

const NAV_ITEMS = [
  { label: "Overview", to: "/admin", end: true },
  { label: "Orders", to: "/admin/orders" },
  { label: "Products", to: "/admin/products" },
  { label: "Customers", to: "/admin/customers" },
];

export function AdminNav() {
  return (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            cn(
              "min-h-11 flex items-center rounded-lg px-3 text-sm font-medium transition-colors duration-fast",
              isActive
                ? "bg-brand/10 text-brand"
                : "text-text-secondary hover:bg-surface-alt hover:text-text-primary",
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

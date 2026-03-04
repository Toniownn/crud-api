import { Outlet } from "react-router-dom";
import { AdminNav } from "./components/AdminNav";
import { SITE_NAME } from "../../lib/constants";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
        <div className="flex h-16 items-center px-5">
          <span className="font-display text-lg text-text-primary">{SITE_NAME}</span>
          <span className="ml-2 rounded-sm bg-brand/15 px-1.5 py-0.5 text-xs font-semibold text-brand">
            Admin
          </span>
        </div>
        <AdminNav />
      </aside>

      <main className="flex-1 bg-surface-alt">
        <div className="px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

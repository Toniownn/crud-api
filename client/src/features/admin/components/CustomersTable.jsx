import { useState } from "react";
import { useAdminData } from "../hooks/useAdminData";
import { fetchUsers, toggleUserStatus, deleteUser } from "../api";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Skeleton } from "../../../components/ui/Skeleton";
import { cn } from "../../../lib/cn";
import { CustomerForm } from "./CustomerForm";

export function CustomersTable() {
  const { data, loading, error, refetch } = useAdminData(fetchUsers);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  function openEdit(customer) {
    setEditingCustomer(customer);
    setFormOpen(true);
  }

  function handleSaved() {
    setFormOpen(false);
    setEditingCustomer(null);
    refetch();
  }

  async function handleToggle(customerId) {
    try {
      await toggleUserStatus(customerId);
      refetch();
    } catch {
      /* error shown via refetch */
    }
  }

  async function handleDelete(customerId, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteUser(customerId);
      refetch();
    } catch {
      /* error shown via refetch */
    }
  }

  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-error/30 bg-error/5 p-5 text-sm text-error">
        <p>Failed to load customers: {error}</p>
        <button
          onClick={refetch}
          className="mt-2 min-h-11 font-medium underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-text-muted">No customers found.</p>
    );
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="sticky top-0 border-b border-border bg-surface text-xs uppercase tracking-wider text-text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Username</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((customer, i) => {
              const auth = customer.customer_auth;
              return (
                <tr
                  key={customer.customer_id}
                  className={cn(
                    "border-b border-border last:border-b-0",
                    i % 2 !== 0 && "bg-surface-alt",
                  )}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="px-4 py-3 font-medium text-text-primary">
                    {customer.fname} {customer.lname}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">
                    {auth?.username || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={auth?.role === "admin" ? "default" : "neutral"}>
                      {auth?.role || "user"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={auth?.disabled ? "error" : "success"}>
                      {auth?.disabled ? "Disabled" : "Active"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(customer)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggle(customer.customer_id)}
                      >
                        {auth?.disabled ? "Enable" : "Disable"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-error hover:bg-error/10"
                        onClick={() =>
                          handleDelete(
                            customer.customer_id,
                            `${customer.fname} ${customer.lname}`,
                          )
                        }
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {formOpen && editingCustomer && (
        <CustomerForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSaved={handleSaved}
          customer={editingCustomer}
        />
      )}
    </div>
  );
}

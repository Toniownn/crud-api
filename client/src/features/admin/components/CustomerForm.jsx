import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { updateUser } from "../api";

export function CustomerForm({ open, onClose, onSaved, customer }) {
  const auth = customer?.customer_auth;

  const [form, setForm] = useState({
    fname: customer?.fname || "",
    lname: customer?.lname || "",
    address: customer?.address || "",
    role: auth?.role || "user",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      await updateUser({
        customer_id: customer.customer_id,
        ...form,
      });
      onSaved();
    } catch (err) {
      setError(err.message || "Failed to update customer");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Edit Customer">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="First Name"
          name="fname"
          value={form.fname}
          onChange={handleChange}
          required
        />
        <Input
          label="Last Name"
          name="lname"
          value={form.lname}
          onChange={handleChange}
          required
        />
        <Input
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
        />
        <div className="space-y-1.5">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-text-primary"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={form.role}
            onChange={handleChange}
            className="min-h-11 w-full rounded-sm border border-border bg-surface px-4 text-sm text-text-primary outline-none transition-colors duration-fast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && (
          <p className="text-sm text-error">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Update"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

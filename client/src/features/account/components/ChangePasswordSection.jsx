import { useState } from "react";
import { changePassword } from "../api";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";

export function ChangePasswordSection() {
  const [form, setForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setFieldErrors((prev) => ({ ...prev, [e.target.name]: null }));
  }

  function validate() {
    const errors = {};
    if (!form.oldPassword) errors.oldPassword = "Current password is required";
    if (!form.newPassword) errors.newPassword = "New password is required";
    if (form.newPassword.length > 0 && form.newPassword.length < 6) {
      errors.newPassword = "Must be at least 6 characters";
    }
    if (form.newPassword !== form.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setSaving(true);
    try {
      await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      });
      setSuccess(true);
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="mt-10 border-t border-border pt-8">
      <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
        Change Password
      </h2>

      {success && (
        <p className="mt-3 rounded-lg border border-success/30 bg-success/5 px-4 py-2.5 text-sm text-success">
          Password changed successfully.
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-error/30 bg-error/5 px-4 py-2.5 text-sm text-error">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-4 max-w-md space-y-4">
        <Input
          label="Current password"
          name="oldPassword"
          type="password"
          value={form.oldPassword}
          onChange={handleChange}
          error={fieldErrors.oldPassword}
          autoComplete="current-password"
        />
        <Input
          label="New password"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          error={fieldErrors.newPassword}
          autoComplete="new-password"
        />
        <Input
          label="Confirm new password"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />
        <Button type="submit" size="sm" disabled={saving}>
          {saving ? "Updating..." : "Update password"}
        </Button>
      </form>
    </section>
  );
}

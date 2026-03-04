import { useState, useRef } from "react";
import { updateProfile, updateProfileImage } from "../api";
import { useAuthStore } from "../../../lib/auth-store";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Skeleton } from "../../../components/ui/Skeleton";

export function ProfileSection({ profile, loading, onSaved }) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({ fname: "", lname: "", address: "" });
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const updateCustomer = useAuthStore((s) => s.updateCustomer);

  async function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    setError(null);
    try {
      const result = await updateProfileImage(file);
      updateCustomer({ profile_image: result.profile_image });
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingImage(false);
    }
  }

  function startEditing() {
    setForm({
      fname: profile?.fname || "",
      lname: profile?.lname || "",
      address: profile?.address || "",
    });
    setError(null);
    setSuccess(false);
    setEditing(true);
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await updateProfile(form);
      setEditing(false);
      setSuccess(true);
      onSaved?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
        <Skeleton className="h-11 w-full" />
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold tracking-tight text-text-primary">
          Profile
        </h2>
        {!editing && (
          <Button variant="outline" size="sm" onClick={startEditing}>
            Edit
          </Button>
        )}
      </div>

      <div className="mt-5 flex items-center gap-5">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-surface-alt">
          {profile?.profile_image ? (
            <img
              src={profile.profile_image}
              alt={`${profile.fname || "User"}'s avatar`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-text-muted">
              {profile?.fname?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
          >
            {uploadingImage ? "Uploading..." : "Change photo"}
          </Button>
          <p className="mt-1 text-xs text-text-muted">JPG, PNG. Max 2MB.</p>
        </div>
      </div>

      {success && (
        <p className="mt-3 rounded-lg border border-success/30 bg-success/5 px-4 py-2.5 text-sm text-success">
          Profile updated successfully.
        </p>
      )}

      {error && (
        <p className="mt-3 rounded-lg border border-error/30 bg-error/5 px-4 py-2.5 text-sm text-error">
          {error}
        </p>
      )}

      {editing ? (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Input
            label="First name"
            name="fname"
            value={form.fname}
            onChange={handleChange}
            required
          />
          <Input
            label="Last name"
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
          <div className="flex gap-3">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-text-muted">First name</dt>
            <dd className="text-text-primary">{profile?.fname || "—"}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-text-muted">Last name</dt>
            <dd className="text-text-primary">{profile?.lname || "—"}</dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-text-muted">Email</dt>
            <dd className="text-text-primary">
              {profile?.customer_auth?.username || "—"}
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-text-muted">Address</dt>
            <dd className="text-text-primary">{profile?.address || "—"}</dd>
          </div>
        </dl>
      )}
    </section>
  );
}

import { useState, useEffect, useCallback } from "react";
import { fetchProfile } from "../api";
import { AccountLayout } from "../components/AccountLayout";
import { ProfileSection } from "../components/ProfileSection";
import { ChangePasswordSection } from "../components/ChangePasswordSection";

export function AccountPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProfile = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchProfile()
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <AccountLayout>
      {error && !loading && (
        <div className="mb-6 rounded-lg border border-error/30 bg-error/5 p-5 text-sm text-error">
          <p>Failed to load profile: {error}</p>
          <button
            onClick={loadProfile}
            className="mt-2 min-h-11 font-medium underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}
      <ProfileSection
        profile={profile}
        loading={loading}
        onSaved={loadProfile}
      />
      <ChangePasswordSection />
    </AccountLayout>
  );
}

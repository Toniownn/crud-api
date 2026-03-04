import { useState, useEffect, useCallback } from "react";
import { fetchProfile, fetchOrders } from "../api";

export function useAccountData() {
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const reloadProfile = useCallback(() => {
    return fetchProfile()
      .then((data) => setProfile(data))
      .catch((err) => setError(err.message));
  }, []);

  const reloadOrders = useCallback(() => {
    return fetchOrders()
      .then((data) => setOrders(data))
      .catch((err) => setError(err.message));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([fetchProfile(), fetchOrders()])
      .then(([profileData, ordersData]) => {
        setProfile(profileData);
        setOrders(ordersData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { profile, orders, loading, error, reloadProfile, reloadOrders };
}

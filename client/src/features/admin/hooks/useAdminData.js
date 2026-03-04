import { useState, useEffect, useCallback } from "react";

export function useAdminData(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refetch = useCallback(() => {
    setLoading(true);
    setError(null);
    fetchFn()
      .then((result) => setData(result))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
}

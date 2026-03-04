import { useAdminData } from "../hooks/useAdminData";
import { fetchDashboard } from "../api";
import { formatPrice } from "../../../lib/format";
import { Skeleton } from "../../../components/ui/Skeleton";

function StatCard({ label, value, style }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5" style={style}>
      <p className="text-sm font-medium text-text-secondary">{label}</p>
      <p className="mt-1 font-display text-2xl text-text-primary">{value}</p>
    </div>
  );
}

export function StatsOverview() {
  const { data, loading, error, refetch } = useAdminData(fetchDashboard);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-error/30 bg-error/5 p-5 text-sm text-error">
        <p>Failed to load dashboard: {error}</p>
        <button
          onClick={refetch}
          className="mt-2 min-h-11 font-medium underline underline-offset-2"
        >
          Retry
        </button>
      </div>
    );
  }

  const stats = [
    { label: "Total Orders", value: data.totalOrders.toLocaleString() },
    {
      label: "Total Revenue",
      value: formatPrice({ amount: data.totalRevenue, currency: "USD" }),
    },
    { label: "Products", value: data.totalProducts.toLocaleString() },
    { label: "Customers", value: data.totalUsers.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          style={{ animationDelay: `${i * 50}ms` }}
        />
      ))}
    </div>
  );
}

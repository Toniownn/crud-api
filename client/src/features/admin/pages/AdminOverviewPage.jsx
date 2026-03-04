import { StatsOverview } from "../components/StatsOverview";

export function AdminOverviewPage() {
  return (
    <div>
      <h1 className="mb-6 font-display text-2xl tracking-tight text-text-primary">
        Dashboard
      </h1>
      <StatsOverview />
    </div>
  );
}

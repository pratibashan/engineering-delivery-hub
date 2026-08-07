import StatCard from "@/components/dashboard/StatCard";
import ProjectList from "@/components/dashboard/ProjectList";
import { dashboardStats, recentProjects } from "@/data/dashboard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
          Dashboard
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Team workspace
        </h1>

        <p className="mt-3 text-slate-400">
          Review team activity, tasks, blockers, and AI-generated summaries.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>

        <ProjectList projects={recentProjects} />
      </section>
    </main>
  );
}

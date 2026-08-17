import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import StatCard from "@/components/dashboard/StatCard";
import ProjectList from "@/components/dashboard/ProjectList";
import { getProjects } from "@/lib/projects.server";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("id_token");

  if (!idToken) {
    redirect("/api/auth/login");
  }

  const projects = await getProjects();

  const dashboardStats = [
    {
      label: "Total projects",
      value: projects.length,
      description: "Projects across the engineering workspace",
    },
    {
      label: "On track",
      value: projects.filter((project) => project.status === "On Track").length,
      description: "Projects progressing as expected",
    },
    {
      label: "At risk",
      value: projects.filter((project) => project.status === "At Risk").length,
      description: "Projects requiring attention",
    },
    {
      label: "Blocked",
      value: projects.filter((project) => project.status === "Blocked").length,
      description: "Projects currently blocked",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Dashboard
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Team workspace
            </h1>

            <p className="mt-3 text-slate-400">
              Review project health, delivery status, blockers, and AI-generated
              insights.
            </p>
          </div>

          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center justify-center rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            + Create project
          </Link>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              description={stat.description}
            />
          ))}
        </div>

        <ProjectList projects={projects} />
      </section>
    </main>
  );
}

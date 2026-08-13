import Link from "next/link";
import { getProjectById } from "@/lib/projects";
import { getProjectStatusClasses } from "@/lib/projectStatus";
import DeleteProjectButton from "@/components/projects/DeleteProjectButton";
import GenerateProjectInsight from "@/components/projects/GenerateProjectInsight";

type ProjectDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { id } = await params;

  const project = await getProjectById(id);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/dashboard"
          className="inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          ← Back to dashboard
        </Link>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Project details
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          {project.name}
        </h1>

        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href={`/dashboard/projects/${project.id}/edit`}
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
          >
            Edit project
          </Link>

          <DeleteProjectButton id={project.id} />
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status</span>

            <span
              className={`rounded-full border px-3 py-1 text-sm font-medium ${getProjectStatusClasses(
                project.status,
              )}`}
            >
              {project.status}
            </span>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Progress</span>
              <span className="font-medium">{project.progress}%</span>
            </div>

            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-cyan-400"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-sm text-slate-500">Description</p>
            <p className="mt-2 text-slate-300">
              {project.description || "No description added."}
            </p>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-sm text-slate-500">Blockers</p>
            <p className="mt-2 text-slate-300">
              {project.blockers || "No blockers reported."}
            </p>
          </div>

          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-sm text-slate-500">Project ID</p>
            <p className="mt-2 break-all text-sm text-slate-300">
              {project.id}
            </p>
          </div>
        </div>
        <GenerateProjectInsight projectId={project.id} />
      </section>
    </main>
  );
}

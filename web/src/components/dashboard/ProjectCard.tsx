import Link from "next/link";
import { getProjectStatusClasses } from "@/lib/projectStatus";
import type { Project } from "@/types/dashboard";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link href={`/dashboard/projects/${project.id}`} className="block">
      <article className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700 hover:bg-slate-900/80">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">{project.name}</h3>

          <span
            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium ${getProjectStatusClasses(
              project.status,
            )}`}
          >
            {project.status}
          </span>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-400">Progress</span>

            <span className="font-medium text-slate-300">
              {project.progress}%
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-cyan-400"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-6 border-t border-slate-800 pt-4">
          <span className="text-sm font-medium text-cyan-400">
            View project →
          </span>
        </div>
      </article>
    </Link>
  );
}

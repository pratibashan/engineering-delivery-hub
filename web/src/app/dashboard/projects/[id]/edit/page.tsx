"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getProjectById, updateProject } from "@/lib/projects";
import type { ProjectStatus } from "@/types/dashboard";

export default function EditProjectPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();

  const id = params.id;

  const [name, setName] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("On Track");
  const [progress, setProgress] = useState(0);
  const [description, setDescription] = useState("");
  const [blockers, setBlockers] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProject() {
      try {
        const project = await getProjectById(id);

        setName(project.name);
        setStatus(project.status);
        setProgress(project.progress);
        setDescription(project.description ?? "");
        setBlockers(project.blockers ?? "");
      } catch (error) {
        console.error(error);
        setError("Unable to load project.");
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [id]);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await updateProject(id, {
        name,
        status,
        progress,
        description,
        blockers,
      });

      router.push(`/dashboard/projects/${id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Unable to update project.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <section className="mx-auto max-w-3xl px-6 py-16">
          <p className="text-slate-400">Loading project...</p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href={`/dashboard/projects/${id}`}
          className="inline-block text-sm font-medium text-cyan-400 hover:text-cyan-300"
        >
          ← Back to project
        </Link>

        <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Projects
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">Edit project</h1>

        <p className="mt-3 text-slate-400">
          Update the project status, progress, or project name.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 space-y-8 rounded-2xl border border-slate-800 bg-slate-900 p-8"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Project name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={4}
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="blockers" className="block text-sm font-medium">
              Blockers
            </label>

            <textarea
              id="blockers"
              value={blockers}
              onChange={(event) => setBlockers(event.target.value)}
              rows={3}
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>

            <select
              id="status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as ProjectStatus)
              }
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
            >
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="progress" className="block text-sm font-medium">
                Progress
              </label>

              <span className="text-sm text-slate-400">{progress}%</span>
            </div>

            <input
              id="progress"
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
              className="mt-4 w-full accent-cyan-400"
            />

            <input
              type="number"
              min={0}
              max={100}
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
              className="mt-4 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none transition focus:border-cyan-400"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-800 pt-6">
            <Link
              href={`/dashboard/projects/${id}`}
              className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

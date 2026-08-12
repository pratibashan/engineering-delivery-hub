"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { createProject } from "@/lib/projects";
import type { ProjectStatus } from "@/types/dashboard";

export default function NewProjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [status, setStatus] = useState<ProjectStatus>("On Track");
  const [progress, setProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      await createProject({
        name,
        status,
        progress,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(error);
      setError("Unable to create project.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
          Projects
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Create project
        </h1>

        <p className="mt-3 text-slate-400">
          Add a new project and start tracking its delivery status and progress.
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
              placeholder="Enter project name"
              required
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
              href="/dashboard"
              className="rounded-lg border border-slate-700 px-5 py-3 font-semibold text-slate-200 transition hover:bg-slate-800"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create project"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}

"use client";

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
      <section className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
          Projects
        </p>

        <h1 className="mt-3 text-4xl font-bold tracking-tight">
          Create project
        </h1>
        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Project name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
              required
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
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
            >
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Blocked">Blocked</option>
            </select>
          </div>

          <div>
            <label htmlFor="progress" className="block text-sm font-medium">
              Progress
            </label>

            <input
              id="progress"
              type="number"
              min={0}
              max={100}
              value={progress}
              onChange={(event) => setProgress(Number(event.target.value))}
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-900 px-4 py-3"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-lg bg-cyan-400 px-5 py-3 font-semibold text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create project"}
          </button>
        </form>
      </section>
    </main>
  );
}

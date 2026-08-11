"use client";

import { useState } from "react";
import ProjectCard from "@/components/dashboard/ProjectCard";
import type { Project, ProjectStatus } from "@/types/dashboard";

type ProjectListProps = {
  projects: Project[];
};

type ProjectFilter = "All" | ProjectStatus;

const filters: ProjectFilter[] = ["All", "On Track", "At Risk", "Blocked"];

export default function ProjectList({ projects }: ProjectListProps) {
  const [selectedFilter, setSelectedFilter] = useState<ProjectFilter>("All");

  const filteredProjects =
    selectedFilter === "All"
      ? projects
      : projects.filter((project) => project.status === selectedFilter);

  return (
    <section className="mt-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white">Recent projects</h2>

        <p className="mt-2 text-slate-400">
          Current delivery status across active initiatives.
        </p>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelectedFilter(filter)}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              selectedFilter === filter
                ? "border-cyan-400 bg-cyan-400 text-slate-950"
                : "border-slate-700 text-slate-300 hover:border-slate-500"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.name}
            name={project.name}
            status={project.status}
            progress={project.progress}
          />
        ))}
      </div>
    </section>
  );
}

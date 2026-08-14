import type { Project } from "@/types/dashboard";
import { fetchWithRefresh } from "@/lib/fetchWithRefresh";

type CreateProjectInput = {
  name: string;
  status: Project["status"];
  progress: number;
  description?: string;
  blockers?: string;
};

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  const response = await fetchWithRefresh("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to create project: ${response.status}`);
  }

  return response.json();
}

type UpdateProjectInput = {
  name: string;
  status: Project["status"];
  progress: number;
  description?: string;
  blockers?: string;
};

export async function updateProject(
  id: string,
  input: UpdateProjectInput,
): Promise<Project> {
  const response = await fetchWithRefresh(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(`Failed to update project: ${response.status}`);
  }

  return response.json();
}

export async function deleteProject(id: string): Promise<void> {
  const response = await fetchWithRefresh(`/api/projects/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(`Failed to delete project: ${response.status}`);
  }
}

export type ProjectSummary = {
  projectId: string;
  summary: string;
};

export async function generateProjectSummary(
  id: string,
): Promise<ProjectSummary> {
  const response = await fetchWithRefresh(`/api/projects/${id}/summary`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to generate project summary: ${response.status}`);
  }

  return response.json();
}

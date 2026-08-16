import { authFetch } from "../auth/authFetch";

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export type Project = {
  id: string;
  name: string;
  status: "On Track" | "At Risk" | "Blocked";
  progress: number;
  description?: string;
  blockers?: string | string[];
};

function getApiBaseUrl(): string {
  if (!apiBaseUrl) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL is not configured.");
  }

  return apiBaseUrl;
}

export async function getProjects(): Promise<Project[]> {
  const response = await authFetch(`${getApiBaseUrl()}/projects`);

  if (!response.ok) {
    throw new Error(`Failed to load projects. Status: ${response.status}`);
  }

  const data = await response.json();

  return Array.isArray(data) ? data : data.projects;
}

export async function getProjectById(id: string): Promise<Project> {
  const response = await authFetch(
    `${getApiBaseUrl()}/projects/${encodeURIComponent(id)}`,
  );

  if (!response.ok) {
    throw new Error(`Failed to load project. Status: ${response.status}`);
  }

  return response.json();
}

export async function getProjectSummary(id: string): Promise<string> {
  const response = await authFetch(
    `${getApiBaseUrl()}/projects/${encodeURIComponent(id)}/summary`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error(
      `Failed to generate AI insight. Status: ${response.status}`,
    );
  }

  const data = await response.json();

  return data.summary;
}

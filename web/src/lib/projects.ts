import type { Project } from "@/types/dashboard";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function getProjects(): Promise<Project[]> {
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  const response = await fetch(`${apiUrl}/projects`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch projects");
  }

  return response.json();
}

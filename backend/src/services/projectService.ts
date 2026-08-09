import {
  getAllProjects as getAllProjectsFromStore,
  getProjectById as getProjectByIdFromStore,
  saveProject,
} from "../data/projectStore";

import type { CreateProjectInput } from "../schemas/projectSchema";
import type { Project } from "../types/project";

export async function getAllProjects(): Promise<Project[]> {
  return getAllProjectsFromStore();
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  return getProjectByIdFromStore(id);
}

export async function createProject(
  input: CreateProjectInput,
): Promise<Project> {
  const project: Project = {
    id: crypto.randomUUID(),
    ...input,
  };

  await saveProject(project);

  return project;
}

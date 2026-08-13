export type ProjectStatus = "On Track" | "At Risk" | "Blocked";

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  description?: string;
  blockers?: string;
};

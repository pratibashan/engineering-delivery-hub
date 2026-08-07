export type DashboardStat = {
  label: string;
  value: number;
  description: string;
};

export type ProjectStatus = "On Track" | "At Risk" | "Blocked";

export type Project = {
  name: string;
  status: ProjectStatus;
  owner: string;
  progress: number;
};
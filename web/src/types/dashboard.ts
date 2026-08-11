export type DashboardStat = {
  label: string;
  value: number;
  description: string;
};

export type ProjectStatus = "On Track" | "At Risk" | "Blocked";

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
};

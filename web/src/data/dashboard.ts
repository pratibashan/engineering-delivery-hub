import type { DashboardStat } from "@/types/dashboard";

export const dashboardStats: DashboardStat[] = [
  {
    label: "Open tasks",
    value: 12,
    description: "Tasks currently requiring attention",
  },
  {
    label: "Active projects",
    value: 4,
    description: "Projects currently in progress",
  },
  {
    label: "Team blockers",
    value: 3,
    description: "Issues affecting delivery",
  },
];

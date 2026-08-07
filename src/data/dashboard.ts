import type {
  DashboardStat,
  Project,
} from "@/types/dashboard";

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

export const recentProjects: Project[] = [
  {
    name: "Mobile Experience",
    status: "On Track",
    owner: "Frontend Team",
    progress: 78,
  },
  {
    name: "AI Summary Service",
    status: "At Risk",
    owner: "Platform Team",
    progress: 54,
  },
  {
    name: "Authentication Upgrade",
    status: "Blocked",
    owner: "Cloud Team",
    progress: 32,
  },
];
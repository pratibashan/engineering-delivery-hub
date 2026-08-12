import type { ProjectStatus } from "@/types/dashboard";

export function getProjectStatusClasses(status: ProjectStatus) {
  switch (status) {
    case "On Track":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";

    case "At Risk":
      return "border-amber-500/30 bg-amber-500/10 text-amber-300";

    case "Blocked":
      return "border-red-500/30 bg-red-500/10 text-red-300";
  }
}

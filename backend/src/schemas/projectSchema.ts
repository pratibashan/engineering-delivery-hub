import { z } from "zod";

export const createProjectSchema = z.object({
  name: z.string().min(1, "Project name is required"),

  status: z.enum(["On Track", "At Risk", "Blocked"]),

  progress: z.number().min(0).max(100),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

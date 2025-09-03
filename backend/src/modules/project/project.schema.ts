import { z } from "zod";

export const createProjectSchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(1, "Project name is required")
			.max(100, "Project name must be less than 100 characters"),
	}),
	query: z.object({}).optional(),
	params: z.object({}).optional(),
});

// Type exports
export type CreateProjectInput = z.infer<typeof createProjectSchema>;

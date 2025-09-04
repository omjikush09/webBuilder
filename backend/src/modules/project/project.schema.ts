import { z } from "zod";

export const createProjectSchema = z.object({
	body: z.object({
		name: z
			.string()
			.min(1, "Project name is required")
			.max(100, "Project name must be less than 100 characters"),
		html: z.string(),
		js: z.string(),
		css: z.string(),
	}),
	query: z.object({}).optional(),
	params: z.object({}).optional(),
});

export const getProjectSchema = z.object({
	params: z.object({
		id: z.uuid(),
	}),
	query: z.object({}).optional(),
	body: z.object({}).optional(),
});

export const updateProjectSchema = z.object({
	params: z.object({
		id: z.uuid(),
	}),
	body: z.object({
		name: z
			.string()
			.min(1, "Project name is required")
			.max(100, "Project name must be less than 100 characters")
			.optional(),
		html: z.json().optional(),
		css: z.json().optional(),
		js: z.json().optional(),
	}),
	query: z.object({}).optional(),
});

export const getProjectsSchema = z.object({
	query: z.object({
		page: z.coerce.number().default(1),
		limit: z.coerce.number().default(10),
	}),
	body: z.object({}).optional(),
	params: z.object({}).optional(),
});

// Type exports
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type GetProjectInput = z.infer<typeof getProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type GetProjectsInput = z.infer<typeof getProjectsSchema>;

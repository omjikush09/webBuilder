import { z } from "zod";

export const chatSchema = z.object({
	body: z.object({
		id: z.string(),
		messages: z.array(
			z.object({
				parts: z.any(),
				role: z.enum(["user", "assistant"]),
				id: z.string(),
			})
		),
	}),
	params: z.object({}).optional(),
	query: z.object({}).optional(),
});

export type ChatSchema = z.infer<typeof chatSchema>;

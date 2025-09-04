import { z } from "zod";

export const createMessageSchema = z.object({
	body: z.object({
		projectId: z.uuid(),
		parts: z.array(
			z.object({
				type: z.string(),
				text: z.string().optional(),
				state: z.string().optional(),
			})
		),
		role: z.enum(["user", "assistant"]),
	}),
	params: z.object({}).optional(),
	query: z.object({}).optional(),
});

export const getMessagesByProjectIdSchema = z.object({
	query: z.object({
		projectId: z.uuid(),
	}),
	params: z.object({}).optional(),
	body: z.object({}).optional(),
});

export type CreateMessageInput = z.infer<typeof createMessageSchema>;
export type GetMessagesInput = z.infer<typeof getMessagesByProjectIdSchema>;

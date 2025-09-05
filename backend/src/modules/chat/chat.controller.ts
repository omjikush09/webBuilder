import { Request, Response } from "express";
import { generateTextService } from "./chat.service";
import { UIMessage } from "ai";
import { ChatSchema } from "./chat.schema";

export const generateTextController = async (
	req: Request<unknown, unknown, ChatSchema["body"]>,
	res: Response
) => {
	const { messages, id } = req.body;

	if (!messages || !Array.isArray(messages)) {
		return res.status(400).json({ error: "Messages array is required." });
	}

	// Get the streaming response from Vercel AI SDK
	const response = await generateTextService(id, messages, res);

	return;
};

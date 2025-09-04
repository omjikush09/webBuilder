import { Request, Response } from "express";
import { generateTextService } from "./chat.service";
import { UIMessage } from "ai";

export const generateTextController = async (req: Request, res: Response) => {
	try {
		const { messages }: { messages: UIMessage[] } = req.body;

		if (!messages || !Array.isArray(messages)) {
			return res.status(400).json({ error: "Messages array is required." });
		}

		// Get the streaming response from Vercel AI SDK
		const response = await generateTextService(messages, res);
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Failed to generate text." });
	}
	return;
};

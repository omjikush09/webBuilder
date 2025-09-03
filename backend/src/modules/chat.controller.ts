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

		// Check if response is valid
		// if (!response.ok) {
		// 	return res.status(500).json({ error: "AI service error" });
		// }

		// // Copy all headers from the AI SDK response
		// response.headers.forEach((value, key) => {
		// 	res.setHeader(key, value);
		// });

		// // Set CORS headers
		// res.setHeader("Access-Control-Allow-Origin", "*");
		// res.setHeader("Access-Control-Allow-Headers", "Cache-Control");

		// Pipe the response directly
		// for await (let chunk of response){
		//     res.write(chunk);
		// }
		// console.log("Response ended");
		// res.end();
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Failed to generate text." });
	}
	return;
};

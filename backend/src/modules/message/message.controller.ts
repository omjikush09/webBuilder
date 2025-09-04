import { Request, Response } from "express";
import { createMessageService, getMessagesService } from "./message.service";
import { CreateMessageInput, GetMessagesInput } from "./message.schema";

export const createMessageController = async (
	req: Request<unknown, unknown, CreateMessageInput["body"]>,
	res: Response
) => {
	try {
		const result = await createMessageService(req.body);
		res.status(201).json(result);
	} catch (error) {
		console.error("Error creating message:", error);
		res.status(500).json({ error: "Failed to create message." });
	}
};

export const getMessagesController = async (
	req: Request<unknown, unknown, unknown, GetMessagesInput["query"]>,
	res: Response
) => {
	try {
		const messages = await getMessagesService(req.query);
		res.status(200).json(messages);
	} catch (error) {
		console.error("Error getting messages:", error);
		res.status(500).json({ error: "Failed to get messages." });
	}
};

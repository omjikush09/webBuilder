import { db } from "../../utils/database";
import { CreateMessageInput, GetMessagesInput } from "./message.schema";
import logger from "../../utils/logger";

export const createMessageService = async (
	input: CreateMessageInput["body"]
) => {
	try {
		const result = await db
			.insertInto("Message")
			.values({
				projectId: input.projectId,
				parts: JSON.stringify(input.parts),
				role: input.role,
			})
			.returningAll()
			.executeTakeFirst();

		return result;
	} catch (error) {
		logger.error("Failed to create message", {
			error,
			projectId: input.projectId,
			role: input.role,
		});
		throw error;
	}
};

export const getMessagesService = async (input: GetMessagesInput["query"]) => {
	try {
		const messages = await db
			.selectFrom("Message")
			.selectAll()
			.where("projectId", "=", input.projectId)
			.orderBy("createdAt", "asc")
			.execute();

		return messages;
	} catch (error) {
		logger.error("Failed to fetch messages", {
			error,
			projectId: input.projectId,
		});
		throw error;
	}
};

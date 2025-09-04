import { db } from "../../utils/database";
import { CreateMessageInput, GetMessagesInput } from "./message.schema";

export const createMessageService = async (
	input: CreateMessageInput["body"]
) => {
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
};

export const getMessagesService = async (input: GetMessagesInput["query"]) => {
	const messages = await db
		.selectFrom("Message")
		.selectAll()
		.where("projectId", "=", input.projectId)
		.orderBy("createdAt", "asc")
		.execute();

	return messages;
};

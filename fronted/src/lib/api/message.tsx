import api from "@/util/axios";
import { UIMessage } from "@ai-sdk/react";

export const saveMessageToDatabase = async ({
	messages,
	projectId,
}: {
	projectId: string;
	messages: UIMessage;
}) => {
	try {
		await api.post(`/message`, {
			...messages,
			projectId,
		});
	} catch (error) {
		console.error(error);
	}
};

import api from "@/util/axios";
import { UIMessage } from "@ai-sdk/react";

export const saveMessageTodb = async ({
	messages,
	projectId,
}: {
	projectId: string;
	messages: UIMessage;
}) => {
	const response = await api.post("/message", {
		...messages,
		projectId,
	});
	return response.data;
};

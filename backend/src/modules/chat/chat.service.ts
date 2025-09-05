import { systemPrompt } from "../../utils/prompt";
import { anthropic, AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { Response } from "express";
import { getProjectService } from "../project/project.service";
import logger from "../../utils/logger";

export const generateTextService = async (
	chatId: string,
	messages: UIMessage[],
	res: Response
) => {
	try {
		const project = await getProjectService(chatId);
		const textStream = streamText({
			model: anthropic("claude-sonnet-4-20250514"),
			system:
				systemPrompt +
				"USE THIS TO GENERATE DIFFS FOR THE FILES. Current state of files are -" +
				JSON.stringify({
					html: project.html,
					css: project.css,
					js: project.js,
				}),

			messages: convertToModelMessages(messages),
			providerOptions: {
				anthropic: {
					thinking: { type: "enabled", budgetTokens: 12000 },
				} satisfies AnthropicProviderOptions,
			},
			// maxOutputTokens:20000
		});

		return textStream.pipeTextStreamToResponse(res);
	} catch (error) {
		logger.error("Failed to generate AI response", {
			error,
			chatId,
			messageCount: messages.length,
		});
		throw error;
	}
};

import { systemPrompt } from "../../utils/prompt";
import { anthropic, AnthropicProviderOptions } from "@ai-sdk/anthropic";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { Response } from "express";

export const generateTextService = async (
	messages: UIMessage[],
	res: Response
) => {
	try {
	
		const textStream = streamText({
			
			model: anthropic("claude-sonnet-4-20250514"),
			system: systemPrompt,
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
		// console.error(error);
		res.end();
	}
	
};

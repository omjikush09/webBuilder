"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import ChatBox from "@/components/ChatBox";
import { TextStreamChatTransport } from "ai";
import {
	getMessageTextContent,
	parseLLMResponse,
	useFileManager,
} from "@/util/responseParser";
import { marked } from "marked";
import { useCode } from "@/context/CodeContext";

interface SidebarProps {
	children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
	const [input, setInput] = useState("Create a red box");

	const { messages, sendMessage, status } = useChat({
		transport: new TextStreamChatTransport({
			api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
		}),
	});

	const { setCode: setCodeContext } = useCode();

	// Use useRef to store the context setter to prevent hook recreation
	const contextSetterRef = useRef(setCodeContext);
	contextSetterRef.current = setCodeContext; // Update ref when setCodeContext changes

	const {  updateFiles } = useFileManager();

	// Process latest assistant message
	useEffect(() => {
		const latestMessage = messages.filter((m) => m.role === "assistant").pop();

		// Only process when streaming is complete (status is 'ready') and we have a message
		if (latestMessage?.parts && status === "ready") {
			const textContent = getMessageTextContent(latestMessage);
			console.log("Text content:", textContent); // Debug log
			const parsed = parseLLMResponse(textContent);
			console.log("Parsed response:", parsed); // Debug log
			if (parsed.diffs.length > 0) {
				console.log("Streaming complete, updating files");
				
				const updated = updateFiles(parsed);
				const newCode = {
					html: updated["index.html"] || "",
					css: updated["styles.css"] || "",
					js: updated["script.js"] || "",
				};
				setCodeContext(newCode);
			}
		}
	}, [messages, status]);

	const submitMessage = () => {
		console.log(input + " df");
		if (input.trim()) {
			sendMessage({ text: input });
			setInput("");
		}
	};

	return (
		<div className="w-1/4 min-w-[400px] h-full bg-background border-r shrink-0 flex flex-col relative p-4">
			{/* Top section for project files and tools */}
			<div className="flex-1 p-4 overflow-auto">
				<div className="space-y-4">
					<div className="text-sm text-muted-foreground">
						Project files and tools will appear here
					</div>
					{messages?.map((message) => (
						<div key={message.id}>
							{message.role === "user" ? "User: " : "AI: "}
							{/* {renderMessageContent(message)} */}

							{message.parts.map((part, index) =>
								part?.type === "text" ? (
									<span
										key={index}
										dangerouslySetInnerHTML={{
											__html:
												message.role === "user"
													? `<span style="color: #2563eb; font-weight: bold;">User:</span> ${marked.parse(
															part.text
													  )}`
													: marked.parse(part.text),
										}}
									/>
								) : null
							)}
						</div>
					))}
				</div>
			</div>

			{/* Bottom section for ChatBox */}
			<div className="">
				<ChatBox
					textAreaValue={input}
					setTextAreaValue={setInput}
					submitButtonFunction={submitMessage}
				/>
			</div>
		</div>
	);
}

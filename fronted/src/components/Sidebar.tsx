"use client";

import React, { useEffect, useRef, useState } from "react";
import { UIMessage, useChat } from "@ai-sdk/react";
import ChatBox from "@/components/ChatBox";
import { TextStreamChatTransport } from "ai";
import { processMessageToFiles } from "@/util/responseParser";
import { ArrowLeft } from "lucide-react";
import { useCode, useAutoScroll } from "@/hooks";
import { MemoizedMarkdown } from "./MemoizedMarkdown";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getChatEndpoint, saveMessageToDatabase, updateProject } from "@/lib/api";

export function Sidebar({
	initialMessages = [],
}: {
	initialMessages: UIMessage[];
}) {
	const { id } = useParams<{ id: string }>();
	const [input, setInput] = useState("");
	const isFirstRender = useRef(true);
	const { code, setCode: setCodeContext } = useCode();
	const { messagesEndRef, messagesContainerRef, scrollToBottom } =
		useAutoScroll();

	const { messages, sendMessage, status, error, regenerate } = useChat({
		messages: initialMessages,
		transport: new TextStreamChatTransport({
			api: getChatEndpoint(),
		}),
		id,
	});

	//Save message to database

	const updateProjectData = async ({
		html,
		css,
		js,
	}: {
		html: string;
		css: string;
		js: string;
	}) => {
		if (!id) return;

		try {
			await updateProject(id, {
				html: html,
				css: css,
				js: js,
			});
		} catch (error) {
			console.error(error);
		}
	};

	// Process latest assistant message
	useEffect(() => {
		const latestMessage = messages.filter((m) => m.role === "assistant").pop();
		// console.log(status);
		// console.log(error);
		// console.log(messages);

		//To skip initial messages
		const initialMessagesLength = initialMessages.length;
		if (messages.length <= initialMessagesLength) return;
		// Only process when streaming is complete (status is 'ready') and we have a message
		if (latestMessage?.parts && status === "ready" && !error) {
			const updatedFiles = processMessageToFiles(latestMessage, {
				"index.html": code.html,
				"styles.css": code.css,
				"script.js": code.js,
			});

			const newCode = {
				html: updatedFiles["index.html"],
				css: updatedFiles["styles.css"],
				js: updatedFiles["script.js"],
			};

			setCodeContext(newCode);
			saveMessageToDatabase({ messages: latestMessage, projectId: id });
			updateProjectData(newCode);
		}
		if (status === "submitted" && !error) {
			const lastUserMessage = messages.filter((m) => m.role === "user").pop();
			if (lastUserMessage) {
				saveMessageToDatabase({ messages: lastUserMessage, projectId: id });
			}
		}
	}, [messages, status]);

	useEffect(() => {
		// When new project starts - only run once on mount
		if (isFirstRender.current && messages.length === 1 && status === "ready") {
			isFirstRender.current = false;
			regenerate({ messageId: messages[0].id });
		}
	}, [messages[0]?.id, status]);

	const submitMessage = () => {
		if (input.trim()) {
			sendMessage({ text: input });
			setInput("");
		}
	};

	// Scroll to bottom whenever messages change (including during streaming)
	useEffect(() => {
		scrollToBottom();
	}, [messages, scrollToBottom]);

	return (
		<div className="w-1/4 min-w-[400px] h-full bg-background border-r shrink-0 flex flex-col relative p-4">
			{/* Top section for project files and tools */}
			<div className="text-sm text-muted-foreground">
				<Link href="/">
					<ArrowLeft />
				</Link>
			</div>
			<div
				className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-background"
				ref={messagesContainerRef}
			>
				<div className="space-y-4">
					{/* {JSON.stringify(messages)} */}
					<div className="flex flex-col w-full">
						{messages?.map((message) => (
							<div
								key={message.id}
								className={`${
									message.role === "user"
										? "bg-muted-foreground rounded-md p-2 self-end mt-1 "
										: "my-2"
								} space-y-4 `}
							>
								{message.role === "assistant" ? "Builder AI:- " : null}

								{message.parts.map((part, index) =>
									part?.type === "text" ? (
										<MemoizedMarkdown
											key={`${message.id}-text`}
											id={message.id}
											content={part.text}
										/>
									) : null
								)}
							</div>
						))}
					</div>
					{status === "submitted" && (
						<div className="text-sm text-muted-foreground">
							<p>Builder AI is thinking...</p>
						</div>
					)}
					{/* Invisible element to scroll to */}
					<div ref={messagesEndRef} />
				</div>
			</div>

			{/* Bottom section for ChatBox */}
			<div className="">
				<ChatBox
					disableButton={status !== "ready" || error !== undefined}
					textAreaValue={input}
					setTextAreaValue={setInput}
					submitButtonFunction={submitMessage}
					placeholder={"Ask Builder AI"}
				/>
			</div>
		</div>
	);
}

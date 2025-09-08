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
import { getChatEndpoint, saveMessageTodb, updateProject } from "@/lib/api";
import { toast } from "sonner";

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
	const saveMessageTodbAndUpdateProject = async (
		messages: UIMessage,
		{ html, css, js }: { html: string; css: string; js: string }
	) => {
		try {
			await Promise.all([
				saveMessageTodb({ messages, projectId: id }),
				updateProject(id, { html, css, js }),
			]);
		} catch (error) {
			toast.error("Failed to save state of project");
		}
	};
	const saveMessage = async (messages: UIMessage, projectId: string) => {
		try {
			await saveMessageTodb({ messages, projectId });
		} catch (error) {
			toast.error("Failed to save message");
		}
	};
	// Process latest assistant message
	useEffect(() => {
		if (status === "streaming") {
			return;
		}
		if (status === "error" && error != undefined) {
			console.log(error);
			const errorMessage = JSON.parse(error?.message);
			if (errorMessage?.error) {
				toast.error(errorMessage?.error);
			} else {
				toast.error("Something Went wrong Please try again");
			}
			return;
		}
		const latestMessage = messages.filter((m) => m.role === "assistant").pop();
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
			saveMessageTodbAndUpdateProject(latestMessage, newCode);
		}
		if (status === "submitted" && !error) {
			const lastUserMessage = messages.filter((m) => m.role === "user").pop();
			if (lastUserMessage) {
				saveMessage(lastUserMessage, id);
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
			<div className="flex items-center justify-between gap-2 text-muted-foreground pb-2">
				<Link href="/">
					<ArrowLeft />
				</Link>
				<h1 className="text-2xl font-bold truncate max-w-[300px]">
					{initialMessages[0].parts[0]?.type === "text"
						? initialMessages[0].parts[0].text
						: "Builder AI"}
				</h1>
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
										? "bg-muted-foreground rounded-md p-2 self-end "
										: ""
								} space-y-4 my-2 `}
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
					disableButton={status !== "ready"}
					textAreaValue={input}
					setTextAreaValue={setInput}
					submitButtonFunction={submitMessage}
					placeholder={"Ask Builder AI"}
				/>
			</div>
		</div>
	);
}

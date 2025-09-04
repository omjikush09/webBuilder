"use client";

import React, { useEffect, useRef, useState } from "react";
import { UIMessage, useChat } from "@ai-sdk/react";
import ChatBox from "@/components/ChatBox";
import { TextStreamChatTransport } from "ai";
import { processMessageToFiles } from "@/util/responseParser";
import { ArrowLeft } from "lucide-react";
import { useCode } from "@/context/CodeContext";
import { MemoizedMarkdown } from "./MemoizedMarkdown";
import Link from "next/link";
import api from "@/util/axios";
import { useParams } from "next/navigation";

export function Sidebar({
	initialMessages = [],
}: {
	initialMessages: UIMessage[];
}) {
	const { id } = useParams<{ id: string }>();
	const [input, setInput] = useState("Create a red box");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const { code, setCode: setCodeContext } = useCode();

	const { messages, sendMessage, status, error } = useChat({
		messages: initialMessages,
		transport: new TextStreamChatTransport({
			api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
		}),
	});

	//Save message to database
	const saveMessageToDatabase = async ({
		messages,
	}: {
		messages: UIMessage;
	}) => {
		try {
			const response = await api.post(
				`${process.env.NEXT_PUBLIC_API_URL}/message`,
				{
					...messages,
					projectId: id,
				}
			);
		} catch (error) {
			console.error(error);
		}
	};

	const updateProject = async ({
		html,
		css,
		js,
	}: {
		html: string;
		css: string;
		js: string;
	}) => {
		try {
			const response = await api.patch(`/project/${id}`, {
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
		// Only process when streaming is complete (status is 'ready') and we have a message
		if (
			latestMessage?.parts &&
			status === "ready" &&
			!error &&
			messages.length > initialMessagesLength
		) {
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
			saveMessageToDatabase({ messages: latestMessage });
			updateProject(newCode);
		}
		if (status === "submitted" && !error) {
			const lastUserMessage = messages.filter((m) => m.role === "user").pop();
			if (lastUserMessage) {
				saveMessageToDatabase({ messages: lastUserMessage });
			}
		}
	}, [messages, status]);

	const submitMessage = () => {
		if (input.trim()) {
			sendMessage({ text: input });
			setInput("");
		}
	};

	// Auto-scroll to bottom when messages change
	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	// Scroll to bottom whenever messages change (including during streaming)
	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	return (
		<div className="w-1/4 min-w-[400px] h-full bg-background border-r shrink-0 flex flex-col relative p-4">
			{/* Top section for project files and tools */}
			<div className="text-sm text-muted-foreground">
				<Link href="/">
					<ArrowLeft />
				</Link>
			</div>
			<div className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-background">
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
				/>
			</div>
		</div>
	);
}

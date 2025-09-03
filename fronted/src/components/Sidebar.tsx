"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import ChatBox from "@/components/ChatBox";
import { TextStreamChatTransport } from "ai";
import { processMessageToFiles } from "@/util/responseParser";
import { ArrowLeft } from "lucide-react";
import { useCode } from "@/context/CodeContext";
import { MemoizedMarkdown } from "./MemoizedMarkdown";
import Link from "next/link";

export function Sidebar() {
	const [input, setInput] = useState("Create a red box");

	const { messages, sendMessage, status } = useChat({
		transport: new TextStreamChatTransport({
			api: `${process.env.NEXT_PUBLIC_API_URL}/chat`,
		}),
	});

	const { code, setCode: setCodeContext } = useCode();

	// Process latest assistant message
	useEffect(() => {
		const latestMessage = messages.filter((m) => m.role === "assistant").pop();

		// Only process when streaming is complete (status is 'ready') and we have a message
		if (latestMessage?.parts && status === "ready") {
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
		}
	}, [messages, status]);

	const submitMessage = () => {
		if (input.trim()) {
			sendMessage({ text: input });
			setInput("");
		}
	};

	return (
		<div className="w-1/4 min-w-[400px] h-full bg-background border-r shrink-0 flex flex-col relative p-4">
			{/* Top section for project files and tools */}
			<div className="flex-1 p-4 overflow-auto">
				<div className="space-y-4 ">
					<div className="text-sm text-muted-foreground">
						<Link href="/">
							<ArrowLeft />
						</Link>
					</div>
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

import React from "react";
import { Button } from "./ui/button";

function ChatBox({
	submitButtonFunction,
	textAreaValue,
	setTextAreaValue,
	disableButton,
}: {
	submitButtonFunction: () => void;
	textAreaValue: string;
	setTextAreaValue: (value: string) => void;
	disableButton?: boolean;
}) {
	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			submitButtonFunction();
		}
	};
	return (
		<div className="flex flex-col w-full h-full bg-neutral-700 rounded-lg p-4 relative gap-4">
			<textarea
				value={textAreaValue}
				onKeyDown={handleKeyPress}
				onChange={(e) => setTextAreaValue(e.target.value)}
				className="w-full h-full active:border-none focus:border-none focus-visible:outline-none"
				placeholder="Ask me anything..."
			/>
			<div className="flex justify-end">
				<Button
					disabled={textAreaValue.length === 0 || disableButton}
					className="cursor-pointer"
					onClick={submitButtonFunction}
				>
					Submit
				</Button>
			</div>
		</div>
	);
}

export default ChatBox;

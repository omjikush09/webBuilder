"use client";
import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { MainContent } from "@/components/MainContent";

function ChatPage() {
	return (
		<div className="h-screen flex bg-background gap-4">
			{/* Left Sidebar with chat functionality */}
			<Sidebar />

			{/* Right Main Content Area */}
			<div className="flex-1 flex p-2">
				<MainContent />
			</div>
		</div>
	);
}

export default ChatPage;

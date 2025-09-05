"use client";

import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { CodeArea } from "@/components/CodeArea";
import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";
import { CodeProvider } from "@/context/CodeContext";
import { useProject } from "@/hooks";
import { useParams } from "next/navigation";

function ChatPage() {
	const { id } = useParams<{ id: string }>();
	const { project, projectMessages, loading, error, fetchData } = useProject({
		id,
	});

	if (loading) {
		return (
			<div className="h-screen bg-background">
				<Loading text="Loading project..." size="lg" />
			</div>
		);
	}

	if (error || !project) {
		return (
			<div className="h-screen bg-background">
				<Error message={error || "Project not found"} onRetry={fetchData} />
			</div>
		);
	}

	return (
		<CodeProvider
			initialCode={{
				html: project.data.html,
				css: project.data.css,
				js: project.data.js,
			}}
		>
			<div className="h-screen flex bg-background gap-4 overflow-hidden">
				{/* Left Sidebar with chat functionality */}
				<Sidebar initialMessages={projectMessages} />

				{/* Right Main Content Area */}
				<div className="flex-1 flex p-2">
					<CodeArea />
				</div>
			</div>
		</CodeProvider>
	);
}

export default ChatPage;

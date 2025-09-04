import React from "react";
import { Sidebar } from "@/components/Sidebar";
import { CodeArea } from "@/components/CodeArea";
import api from "@/util/axios";
import { notFound } from "next/navigation";
import { UIMessage } from "@ai-sdk/react";
import { CodeProvider } from "@/context/CodeContext";
type ProjectReponse = {
	data: {
		id: string;
		name: string;
		html: string;
		css: string;
		js: string;
	};
};

async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const project = await api.get<ProjectReponse>(`/project/${id}`);
	const projectMessges = await api.get<UIMessage[]>(`/message/`, {
		params: {
			projectId: id,
		},
	});

	if (projectMessges.status !== 200) {
		return notFound();
	}

	return (
		<CodeProvider
			initialCode={{
				html: project.data.data.html,
				css: project.data.data.css,
				js: project.data.data.js,
			}}
		>
			<div className="h-screen flex bg-background gap-4 overflow-hidden">
				{/* Left Sidebar with chat functionality */}
				<Sidebar initialMessages={projectMessges.data} />

				{/* Right Main Content Area */}
				<div className="flex-1 flex p-2">
					<CodeArea />
				</div>
			</div>
		</CodeProvider>
	);
}

export default ChatPage;

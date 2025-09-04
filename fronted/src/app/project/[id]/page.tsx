"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { CodeArea } from "@/components/CodeArea";
import { Loading } from "@/components/Loading";
import { Error } from "@/components/Error";
import api from "@/util/axios";
import { notFound, useParams } from "next/navigation";
import { UIMessage } from "@ai-sdk/react";
import { CodeProvider } from "@/context/CodeContext";

type ProjectResponse = {
	data: {
		id: string;
		name: string;
		html: string;
		css: string;
		js: string;
	};
};

function ChatPage() {
	const { id } = useParams<{ id: string }>();
	const [project, setProject] = useState<ProjectResponse | null>(null);
	const [projectMessages, setProjectMessages] = useState<UIMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		try {
			setLoading(true);
			setError(null);

			// Fetch project data
			const projectResponse = await api.get<ProjectResponse>(`/project/${id}`);
			setProject(projectResponse.data);

			// Fetch project messages
			const messagesResponse = await api.get<UIMessage[]>(`/message/`, {
				params: { projectId: id },
			});

			if (messagesResponse.status === 200) {
				setProjectMessages(messagesResponse.data);
			}
		} catch (err) {
			console.error("Failed to fetch project data:", err);
			setError("Failed to load project");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, [id]);

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

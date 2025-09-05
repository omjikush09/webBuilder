"use client";

import ChatBox from "@/components/ChatBox";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProject, getProjects, saveMessageToDatabase } from "@/lib/api";

export default function Home() {
	const router = useRouter();

	const [message, setMessage] = useState("");
	const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
	const [projectState, setProjectState] = useState<{
		data: string;
		isLoading: boolean;
		error: string;
	}>({ isLoading: false, error: "", data: "" });

	const createNewProject = async () => {
		setProjectState({ ...projectState, isLoading: true, error: "" });
		try {
			const response = await createProject({
				name: message,
				html: "",
				css: "",
				js: "",
			});
			const id = response.data.id;
			await saveMessageToDatabase({
				messages: {
					id: "",
					role: "user",
					parts: [{ type: "text", text: message }],
				},
				projectId: id,
			});
			router.push(`/project/${id}`);
		} catch (error) {
			toast.error("Something Went wrong");
			setProjectState({ ...projectState, error: "Something Went Wrong" });
		} finally {
			setProjectState({ ...projectState, isLoading: false });
		}
	};

	const fetchProjects = async () => {
		const response = await getProjects();
		setProjects(response.data);
	};
	useEffect(() => {
		fetchProjects();
	}, []);

	return (
		<main className="w-screen min-h-screen    px-4  grid place-items-center  bg-zinc-500    text-stone-300">
			<div className="mx-auto flex  w-full flex-col items-center gap-7 max-md:pt-4 max-w-2xl">
				{/* Welcome message */}

				<div
					className="inline-block max-w-full align-middle max-md:line-clamp-2 max-md:break-words md:overflow-hidden md:overflow-ellipsis select-none text-stone-300 text-4xl"
					style={{ opacity: 1 }}
				>
					What should we build today?
				</div>

				{/* Chat input */}
				<ChatBox
					disableButton={projectState.isLoading}
					submitButtonFunction={createNewProject}
					textAreaValue={message}
					setTextAreaValue={setMessage}
				/>
				<h1 className="text-2xl font-bold">Projects</h1>
				<div className="flex  gap-2 overflow-x-auto w-full flex-wrap">
					{projects.map((project) => (
						<div
							className="flex items-center justify-center bg-neutral-700 gap-7 rounded-md p-4 cursor-pointer    text-center truncate"
							key={project.id}
							onClick={() => router.push(`/project/${project.id}`)}
						>
							{project.name}
						</div>
					))}
				</div>
			</div>
		</main>
	);
}

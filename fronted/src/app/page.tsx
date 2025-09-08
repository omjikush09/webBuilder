"use client";

import ChatBox from "@/components/ChatBox";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProject, getProjects, saveMessageTodb } from "@/lib/api";
import { Marquee } from "@/components/magicui/marquee";
import { Loading } from "@/components/Loading";

export default function Home() {
	const router = useRouter();

	const [message, setMessage] = useState("");
	const [projects, setProjects] = useState<{ id: string; name: string }[]>([]);
	const [projectState, setProjectState] = useState<{
		isLoading: boolean;
		error: string;
	}>({ isLoading: false, error: "" });

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
			await saveMessageTodb({
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
		setProjectState({ ...projectState, isLoading: true, error: "" });
		try {
			const response = await getProjects();
			setProjects(response.data);
		} catch (error) {
			toast.error("Failed to get projects");
			setProjectState({ ...projectState, error: "Failed to get projects" });
		} finally {
			setProjectState({ ...projectState, isLoading: false });
		}
	};
	useEffect(() => {
		fetchProjects();
	}, []);

	return (
		<main className="w-screen h-screen    px-4    bg-zinc-500    text-stone-300">
			<div className=" flex flex-col h-full w-full gap-7">
				<div className=" flex h-2/3 w-full items-center flex-col justify-end gap-7 max-md:pt-4">
					{/* Welcome message */}

					<div className="inline-block max-w-full overflow-ellipsis select-none text-stone-300 text-4xl">
						<div>{projectState.isLoading && <Loading />}</div>
						What should we build today?
					</div>

					{/* Chat input */}
					<div className="w-full max-w-2xl">
						<ChatBox
							disableButton={projectState.isLoading}
							submitButtonFunction={createNewProject}
							textAreaValue={message}
							setTextAreaValue={setMessage}
						/>
					</div>
					{projects.length > 0 && (
						<h1 className="text-2xl font-bold text-center ">Projects</h1>
					)}
				</div>
				<div className="flex relative   gap-2 overflow-x-auto w-full flex-wrap">
					<Marquee pauseOnHover>
						{projects.map((project) => (
							<div
								className="flex items-center justify-center bg-neutral-700 gap-7 rounded-md p-4 cursor-pointer    text-center "
								key={project.id}
								onClick={() => router.push(`/project/${project.id}`)}
							>
								<span className="truncate w-[180px]">{project.name}</span>
							</div>
						))}
					</Marquee>
				</div>
			</div>
		</main>
	);
}

"use client";

import ChatBox from "@/components/ChatBox";
import api from "@/util/axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Home() {
	const router = useRouter();

	const [message, setMessage] = useState("");
	const [projectState, setProjectState] = useState<{
		data: string;
		isLoading: boolean;
		error: string;
	}>({ isLoading: false, error: "", data: "" });

	const createProject = async () => {
		setProjectState({ ...projectState, isLoading: true, error: "" });
		try {
			const response = await api.post<
				{ name: string },
				{ data: { data: { id: string } } }
			>("/project", {
				name: message,
			});
			const id = response.data.data.id;
			router.push(`/project/${id}`);
		} catch (error) {
			toast.error("Something Went wrong");
			setProjectState({ ...projectState, error: "Something Went Wrong" });
		} finally {
			setProjectState({ ...projectState, isLoading: false });
		}
	};

	return (
		<main className="  w-full  px-4  grid place-items-center  bg-zinc-500   h-screen text-stone-300">
			<div className="mx-auto flex w-full flex-col items-center gap-7 max-md:pt-4 max-w-2xl">
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
					submitButtonFunction={createProject}
					textAreaValue={message}
					setTextAreaValue={setMessage}
				/>
			</div>
		</main>
	);
}

import { useState, useEffect, useCallback } from "react";
import { UIMessage } from "@ai-sdk/react";
import {
	getProject,
	getProjectMessages,
	updateProject as updateProjectAPI,
	ProjectResponse,
	UpdateProjectData,
} from "@/lib/api";

export const useProject = ({ id }: { id: string | undefined }) => {
	const [project, setProject] = useState<ProjectResponse | null>(null);
	const [projectMessages, setProjectMessages] = useState<UIMessage[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchData = useCallback(async () => {
		if (!id) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true);
			setError(null);

			// Fetch project data
			const projectResponse = await getProject(id);
			setProject(projectResponse);

			// Fetch project messages
			const messagesResponse = await getProjectMessages(id);
			setProjectMessages(messagesResponse);
		} catch (err) {
			console.error("Failed to fetch project data:", err);
			setError("Failed to load project");
		} finally {
			setLoading(false);
		}
	}, [id]);

	const updateProject = async (data: UpdateProjectData) => {
		if (!id) {
			throw new Error("Project ID is required for update");
		}

		try {
			const response = await updateProjectAPI(id, data);
			return response;
		} catch (error) {
			console.error("Failed to update project:", error);
			throw error;
		}
	};

	useEffect(() => {
		fetchData();
	}, [id, fetchData]);

	return {
		project,
		projectMessages,
		loading,
		error,
		fetchData,
		updateProject,
	};
};

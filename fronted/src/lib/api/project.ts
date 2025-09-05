import api from "@/util/axios";
import { UIMessage } from "@ai-sdk/react";

export type ProjectResponse = {
	data: {
		id: string;
		name: string;
		html: string;
		css: string;
		js: string;
	};
};

export type Project = {
	id: string;
	name: string;
};

export type CreateProjectData = {
	name: string;
	html: string;
	css: string;
	js: string;
};

export type UpdateProjectData = {
	html: string;
	css: string;
	js: string;
};

// Create a new project
export const createProject = async (data: CreateProjectData) => {
	const response = await api.post<
		CreateProjectData,
		{ data: { data: { id: string } } }
	>("/project", data);
	return response.data;
};

// Get all projects
export const getProjects = async () => {
	const response = await api.get<{ data: Project[] }>("/project");
	return response.data;
};

// Get a single project by ID
export const getProject = async (id: string) => {
	const response = await api.get<ProjectResponse>(`/project/${id}`);
	return response.data;
};

// Update a project
export const updateProject = async (id: string, data: UpdateProjectData) => {
	const response = await api.patch(`/project/${id}`, data);
	return response.data;
};

// Get messages for a project
export const getProjectMessages = async (projectId: string) => {
	const response = await api.get<UIMessage[]>("/message/", {
		params: { projectId },
	});
	return response.data;
};

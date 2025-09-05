import { Request, Response } from "express";
import {
	createProjectService,
	getProjectService,
	getProjectsService,
	updateProjectService,
} from "./project.service";
import {
	CreateProjectInput,
	GetProjectInput,
	GetProjectsInput,
	UpdateProjectInput,
} from "./project.schema";

export const createProjectController = async (
	req: Request<unknown, unknown, CreateProjectInput["body"]>,
	res: Response
) => {
	try {
		const project = await createProjectService(req.body);

		res.status(201).json({
			data: project,
			message: "Project created successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: "Failed to create project",
		});
	}
};

export const getProjectController = async (
	req: Request<GetProjectInput["params"], unknown, unknown>,
	res: Response
) => {
	try {
		const project = await getProjectService(req.params.id);
		res.status(200).json({
			data: project,
			message: "Project fetched successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: "Failed to get project",
		});
	}
};

export const updateProjectController = async (
	req: Request<
		UpdateProjectInput["params"],
		unknown,
		UpdateProjectInput["body"]
	>,
	res: Response
) => {
	try {
		const project = await updateProjectService(req.params.id, req.body);
		res.status(200).json({
			data: project,
			message: "Project updated successfully",
		});
	} catch (error) {
		res.status(500).json({
			error: "Failed to update project",
		});
	}
};

export const getProjectsController = async (
	req: Request<unknown, GetProjectsInput["query"], unknown>,
	res: Response
) => {
	try {
		const projects = await getProjectsService({
			page: Number(req.query.page) || 1,
			limit: Number(req.query.limit) || 10,
		});
		res.status(200).json({
			message: "Projects fetched successfully",
			...projects,
		});
	} catch (error) {
		res.status(500).json({
			error: "Failed to get projects",
		});
	}
};

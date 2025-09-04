import { Request, Response } from "express";
import { createProjectService, getProjectService, updateProjectService } from "./project.service";
import { CreateProjectInput, GetProjectInput, UpdateProjectInput } from "./project.schema";

export const createProjectController = async (
	req: Request<unknown, unknown, CreateProjectInput["body"]>,
	res: Response
) => {
	try {
		const project = await createProjectService(req.body);

		res.status(201).json({
			success: true,
			data: project,
			message: "Project created successfully",
		});
	} catch (error) {
		console.error("Create project error:", error);
		res.status(500).json({
			success: false,
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
			success: true,
			data: project,
			message: "Project fetched successfully",
		});
	} catch (error) {
		console.error("Get project error:", error);
		res.status(500).json({
			success: false,
			error: "Failed to get project",
		});
	}
};

export const updateProjectController = async (
	req: Request<UpdateProjectInput["params"], unknown, UpdateProjectInput["body"]>,
	res: Response
) => {
	try {
		const project = await updateProjectService(req.params.id, req.body);
		res.status(200).json({
			success: true,
			data: project,
			message: "Project updated successfully",
		});
	} catch (error) {
		console.error("Update project error:", error);
		res.status(500).json({
			success: false,
			error: "Failed to update project",
		});
	}
};
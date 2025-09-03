import { Request, Response } from "express";
import { createProjectService } from "./project.service";
import { CreateProjectInput } from "./project.schema";

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

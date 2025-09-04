import { CreateProjectInput, UpdateProjectInput } from "./project.schema";
import { db } from "../../utils/database";

export const createProjectService = async (
	data: CreateProjectInput["body"]
) => {
	try {
		const newProject = await db
			.insertInto("Project")
			.values({
				name: data.name,
			})
			.returningAll()
			.executeTakeFirst();

		return newProject;
	} catch (error) {
		console.error(error);
		throw new Error(`Failed to create project: ${error}`);
	}
};

export const getProjectService = async (id: string) => {
	const project = await db
		.selectFrom("Project")
		.selectAll()
		.where("id", "=", id)
		.executeTakeFirst();
	return project;
};

export const updateProjectService = async (
	id: string,
	data: UpdateProjectInput["body"]
) => {
	const project = await db
		.updateTable("Project")
		.set({
			html: JSON.stringify(data.html),
			css: JSON.stringify(data.css),
			js: JSON.stringify(data.js),
		})
		.where("id", "=", id)
		.returningAll()
		.executeTakeFirst();
	return project;
};

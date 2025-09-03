import { CreateProjectInput } from "./project.schema";
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
        console.error(error)
		throw new Error(`Failed to create project: ${error}`);
	}
};

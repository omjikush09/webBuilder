import {
	CreateProjectInput,
	GetProjectsInput,
	UpdateProjectInput,
} from "./project.schema";
import { db } from "../../utils/database";

export const createProjectService = async (
	data: CreateProjectInput["body"]
) => {
	try {
		const newProject = await db
			.insertInto("Project")
			.values({
				name: data.name,
				html: JSON.stringify(data.html || ""),
				css: JSON.stringify(data.css || ""),
				js: JSON.stringify(data.js || ""),
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
	try {
		const project = await db
			.selectFrom("Project")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();

		if (!project) {
			throw new Error(`Project with id ${id} not found`);
		}

		return project;
	} catch (error) {
		console.error("Failed to get project:", error);
		throw new Error(
			`Failed to get project: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
};

export const updateProjectService = async (
	id: string,
	data: UpdateProjectInput["body"]
) => {
	try {
		const project = await db
			.updateTable("Project")
			.set({
				html: JSON.stringify(data.html || ""),
				css: JSON.stringify(data.css || ""),
				js: JSON.stringify(data.js || ""),
			})
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirst();

		if (!project) {
			throw new Error(`Project with id ${id} not found`);
		}

		return project;
	} catch (error) {
		console.error("Failed to update project:", error);
		throw new Error(
			`Failed to update project: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
};

export const getProjectsService = async ({
	page = 1,
	limit = 10,
}: GetProjectsInput["query"]) => {
	try {
		const result = await db.transaction().execute(async (trx) => {
			const [{ total }] = await trx
				.selectFrom("Project")
				.select(({ fn }) => [fn.countAll().as("total")])
				.execute();

			const skip = (page - 1) * limit;
			const projects = await trx
				.selectFrom("Project")
				.selectAll()
				.orderBy("createdAt", "desc")
				.limit(limit)
				.offset(skip)
				.execute();

			return {
				data: projects,
				total: Number(total),
				page,
				limit,
			};
		});

		return result;
	} catch (error) {
		console.error("Failed to get projects:", error);
		throw new Error(
			`Failed to get projects: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
};

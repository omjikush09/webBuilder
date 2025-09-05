import { Router } from "express";
import {
	createProjectController,
	getProjectController,
	getProjectsController,
	updateProjectController,
} from "./project.controller";
import { validateRequest } from "../../middleware/validateRequest";
import {
	createProjectSchema,
	getProjectSchema,
	getProjectsSchema,
	updateProjectSchema,
} from "./project.schema";

const router: Router = Router();

// Create a new project with validation middleware
router.post("/", validateRequest(createProjectSchema), createProjectController);
router.get("/:id", validateRequest(getProjectSchema), getProjectController);
router.patch(
	"/:id",
	validateRequest(updateProjectSchema),
	updateProjectController
);
router.get("/", validateRequest(getProjectsSchema), getProjectsController);

export default router;

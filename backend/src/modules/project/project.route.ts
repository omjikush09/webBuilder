import { Router } from "express";
import {
	createProjectController,
	getProjectController,
    updateProjectController,
} from "./project.controller";
import { validationError } from "../../middleware/validationError";
import { createProjectSchema, getProjectSchema, updateProjectSchema } from "./project.schema";

const router: Router = Router();

// Create a new project with validation middleware
router.post("/", validationError(createProjectSchema), createProjectController);
router.get("/:id", validationError(getProjectSchema), getProjectController);
router.patch("/:id", validationError(updateProjectSchema), updateProjectController);

export default router;

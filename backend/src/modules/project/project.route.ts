import { Router } from "express";
import { createProjectController } from "./project.controller";
import { validationError } from "../../middleware/validationError";
import { createProjectSchema } from "./project.schema";

const router: Router = Router();

// Create a new project with validation middleware
router.post("/", validationError(createProjectSchema), createProjectController);

export default router;

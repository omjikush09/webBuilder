import { Router } from "express";
import { generateTextController } from "./chat.controller";
import { validateRequest } from "../../middleware/validationError";
import { chatSchema } from "./chat.schema";

const router: Router = Router();

router.post("/", validateRequest(chatSchema), generateTextController);

export default router;

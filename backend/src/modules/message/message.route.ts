import { Router } from "express";
import {
	createMessageController,
	getMessagesController,
} from "./message.controller";
import {
	createMessageSchema,
	getMessagesByProjectIdSchema,
} from "./message.schema";
import { validationError } from "../../middleware/validationError";

const router: Router = Router();

router.post("/", validationError(createMessageSchema), createMessageController);
router.get(
	"/",
	validationError(getMessagesByProjectIdSchema),
	getMessagesController
);

export default router;

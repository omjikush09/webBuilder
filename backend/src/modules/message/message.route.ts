import { Router } from "express";
import {
	createMessageController,
	getMessagesController,
} from "./message.controller";
import {
	createMessageSchema,
	getMessagesByProjectIdSchema,
} from "./message.schema";
import { validateRequest } from "../../middleware/validateRequest";

const router: Router = Router();

router.post("/", validateRequest(createMessageSchema), createMessageController);
router.get(
	"/",
	validateRequest(getMessagesByProjectIdSchema),
	getMessagesController
);

export default router;

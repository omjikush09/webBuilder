import { Router } from "express";
import { generateTextController } from "./chat.controller";

const router: Router = Router();

router.post("/", generateTextController);

export default router;

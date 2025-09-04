import { Router } from "express";
import projectRoutes from "../modules/project/project.route";
import messageRoutes from "../modules/message/message.route";
import chatRoute from "../modules/chat/chat.route";
import projectRoute from "../modules/project/project.route";

const router: Router = Router();

// API routes
router.get("/api", (req, res) => {
	res.json({
		message: "Website Builder API",
		endpoints: {
			health: "/health",
			api: "/api",
			projects: "/v1/projects",
			messages: "/v1/messages",
		},
	});
});



// Routes
router.use("/v1/chat", chatRoute);
router.use("/v1/project", projectRoute);
router.use("/v1/message", messageRoutes);

export default router;
